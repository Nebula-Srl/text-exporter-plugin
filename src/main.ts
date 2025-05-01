// Read the docs https://plugma.dev/docs

export default function () {
  figma.showUI(__html__, { width: 380, height: 380 });

  const run = async () => {
    const textData: Record<string, Record<string, string>> = {}; // Object to store extracted data
    const frames: string[] = [];
    const formatKey = (key: string) =>
      key
        .replace("-", "")
        .replace("  ", " ")
        .replace(/\s+/g, "_")
        .toLowerCase();

    function processFrame(frame: FrameNode, frameName: string) {
      const frameText: Record<string, string> = {}; // Store text inside this board
      function findTextLayers(node: SceneNode) {
        if (node.type === "TEXT") {
          let textKey = formatKey(node.name); // Convert text name to underscore format
          // if frameText already has this key, append a number to it
          let i = 1;
          while (frameText[textKey]) {
            textKey = `${formatKey(node.name)}_${i}`;
            i++;
          }
          frameText[textKey] = (node as TextNode).characters;
        }
        if ("children" in node) {
          for (const child of node.children) {
            findTextLayers(child);
          }
        }
      }

      findTextLayers(frame);
      textData[formatKey(frameName)] = frameText; // Assign extracted text to this board
    }

    // Process all top-level frames (boards)
    const frameText: Record<string, string> = {}; // Store text inside this board
    figma.currentPage.selection.forEach((node) => {
      if (node.type === "FRAME" && node.visible) {
        let textKey = formatKey(node.name); // Convert text name to underscore format
        let i = 1;
        while (frameText[textKey]) {
          textKey = `${formatKey(node.name)}_${i}`;
          i++;
        }
        frames.push(textKey);
        frameText[textKey] = node.name; // Store the frame name
        processFrame(node, textKey);
      }
    });

    // Send data to the UI
    figma.ui.postMessage({
      type: "export",
      textData,
      frames,
    });
  };
  run();
  let selectedFrameIds: Set<string> = new Set();

  figma.on("selectionchange", () => {
    const selectedFrames = figma.currentPage.selection.filter(
      (node) => node.type === "FRAME"
    ) as FrameNode[];
    const selectedFrameIdsNew = new Set(
      selectedFrames.map((frame) => frame.id)
    );
    if (selectedFrameIdsNew.size !== selectedFrameIds.size) {
      console.log("Selection changed");
      selectedFrameIds = selectedFrameIdsNew;
      run();
    }
  });
  figma.ui.onmessage = async (msg) => {
    if (msg.type === "getStorage") {
      const value = await figma.clientStorage.getAsync(msg.key);
      figma.ui.postMessage({
        type: "storageValue",
        key: msg.key,
        value,
      });
    }

    if (msg.type === "setStorage") {
      await figma.clientStorage.setAsync(msg.key, msg.value);
    }

    if (msg.type === "deleteStorage") {
      await figma.clientStorage.deleteAsync(msg.key);
    }
  };
}
