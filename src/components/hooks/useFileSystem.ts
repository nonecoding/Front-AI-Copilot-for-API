import { useState } from 'react';

export interface FileSystemItem {
  id: string;
  name: string;
  type: 'file' | 'folder';
  parentId: string | null;
  path: string;
  children?: string[];
  expanded?: boolean;
  icon?: string;
  extension?: string;
}

export const useFileSystem = () => {
  const [files, setFiles] = useState<Record<string, FileSystemItem>>({});
  const [currentPath, setCurrentPath] = useState<string[]>([]);

  const createFile = (
    name: string, 
    parentId: string | null = null, 
    type: 'file' | 'folder' = 'file'
  ) => {
    const id = `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    const parentPath = parentId ? files[parentId].path : '';
    const path = `${parentPath}${parentPath ? '/' : ''}${name}`;
    
    const newFile: FileSystemItem = {
      id,
      name,
      type,
      parentId,
      path,
      children: type === 'folder' ? [] : undefined,
      expanded: false,
    };
    
    // Update parent's children if parent exists
    if (parentId && files[parentId]) {
      setFiles(prev => ({
        ...prev,
        [parentId]: {
          ...prev[parentId],
          children: [...(prev[parentId].children || []), id]
        }
      }));
    }
    
    setFiles(prev => ({
      ...prev,
      [id]: newFile
    }));
    
    return id;
  };

  const deleteFile = (id: string) => {
    const fileToDelete = files[id];
    
    // First recursively delete all children if it's a folder
    if (fileToDelete.type === 'folder' && fileToDelete.children) {
      fileToDelete.children.forEach(childId => {
        deleteFile(childId);
      });
    }
    
    // Update parent's children list
    if (fileToDelete.parentId) {
      setFiles(prev => ({
        ...prev,
        [fileToDelete.parentId!]: {
          ...prev[fileToDelete.parentId!],
          children: prev[fileToDelete.parentId!].children!.filter(
            childId => childId !== id
          )
        }
      }));
    }
    
    // Remove the file itself
    setFiles(prev => {
      const newFiles = { ...prev };
      delete newFiles[id];
      return newFiles;
    });
  };

  const toggleExpand = (id: string) => {
    setFiles(prev => ({
      ...prev,
      [id]: {
        ...prev[id],
        expanded: !prev[id].expanded
      }
    }));
  };

  const navigateTo = (path: string[]) => {
    setCurrentPath(path);
  };

  return {
    files,
    currentPath,
    createFile,
    deleteFile,
    toggleExpand,
    navigateTo
  };
};