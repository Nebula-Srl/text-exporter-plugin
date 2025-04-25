// Read the docs https://plugma.dev/docs

export default function () {
  figma.showUI(__html__, { width: 380, height: 350 });

  const run = async () => {
    const textData: Record<string, Record<string, string>> = {}; // Object to store extracted data
    const frames: string[] = [];
    const formatKey = (key: string) =>
      key
        .replace("-", "")
        .replace("  ", " ")
        .replace(/\s+/g, "_")
        .toLowerCase();

    function processFrame(frame: FrameNode) {
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
      textData[formatKey(frame.name)] = frameText; // Assign extracted text to this board
    }

    // Process all top-level frames (boards)
    figma.currentPage.selection.forEach((node) => {
      if (node.type === "FRAME" && node.visible) {
        frames.push(node.name);
        processFrame(node);
      }
    });

    // Add listener on new selection
    figma.on("selectionchange", () => {
      run();
    });
    // Send data to the UI
    figma.ui.postMessage({
      type: "export",
      textData,
      frames,
    });
  };
  run();

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
