import { createContext, useContext } from 'react';

type NodeCanvasContextValue = {
  consumeContextMenuSuppression: () => boolean;
  editable: boolean;
};

const NodeCanvasContext = createContext<NodeCanvasContextValue>({
  consumeContextMenuSuppression: () => false,
  editable: true,
});

export const NodeCanvasProvider = NodeCanvasContext.Provider;

export function useNodeCanvasContext() {
  return useContext(NodeCanvasContext);
}
