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

    let selectedFrames: string[] = [];
    let debounceTimer: number | undefined | NodeJS.Timeout;

    // Add listener on new selection
    figma.on("selectionchange", () => {
      const elaborateFrames = () => {
        const selection = figma.currentPage.selection;

        if (selection.length === 0) {
          run();
          return;
        }
        const newSelectedFrames: string[] = [];
        for (const node of selection) {
          if (node.type === "FRAME" && node.visible) {
            newSelectedFrames.push(node.id);
          }
        }

        // Check if the new selection is different from the previous one
        if (
          JSON.stringify(newSelectedFrames) !== JSON.stringify(selectedFrames)
        ) {
          selectedFrames = newSelectedFrames;
          console.log("Selected frames changed:", selectedFrames);
          run();
        }
      };
      if (debounceTimer) {
        console.log("Clearing debounce timer");
        clearTimeout(debounceTimer);
      }
      debounceTimer = setTimeout(() => {
        console.log("Debounce timer expired, running elaborateFrames");
        elaborateFrames();
      }, 2000); // adjust delay as needed (ms)
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
