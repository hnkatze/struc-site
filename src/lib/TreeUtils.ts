export interface TreeNode {
    value: number
    left: TreeNode | null
    right: TreeNode | null
}

// Crear un nuevo nodo
export const createNode = (value: number): TreeNode => {
    return {
        value,
        left: null,
        right: null,
    }
}

// Insertar un nodo en un BST
export const insertNode = (root: TreeNode | null, value: number): TreeNode => {
    if (root === null) {
        return createNode(value)
    }

    if (value < root.value) {
        root.left = insertNode(root.left, value)
    } else if (value > root.value) {
        root.right = insertNode(root.right, value)
    }

    return root
}

// Encontrar el nodo con el valor mínimo
export const findMinNode = (node: TreeNode): TreeNode => {
    let current = node
    while (current.left !== null) {
        current = current.left
    }
    return current
}

// Eliminar un nodo de un BST
export const removeNode = (root: TreeNode | null, value: number): TreeNode | null => {
    if (root === null) {
        return null
    }

    if (value < root.value) {
        root.left = removeNode(root.left, value)
    } else if (value > root.value) {
        root.right = removeNode(root.right, value)
    } else {
        // Caso 1: Nodo hoja (sin hijos)
        if (root.left === null && root.right === null) {
            return null
        }

        // Caso 2: Nodo con un solo hijo
        if (root.left === null) {
            return root.right
        }

        if (root.right === null) {
            return root.left
        }

        // Caso 3: Nodo con dos hijos
        // Encontrar el sucesor inorden (el valor mínimo en el subárbol derecho)
        const temp = findMinNode(root.right)
        root.value = temp.value
        root.right = removeNode(root.right, temp.value)
    }

    return root
}

// Buscar un nodo en un BST
export const searchNode = (root: TreeNode | null, value: number): TreeNode | null => {
    if (root === null || root.value === value) {
        return root
    }

    if (value < root.value) {
        return searchNode(root.left, value)
    }

    return searchNode(root.right, value)
}

// Recorridos del árbol
export const inOrderTraversal = (root: TreeNode | null, result: number[] = []): number[] => {
    if (root !== null) {
        inOrderTraversal(root.left, result)
        result.push(root.value)
        inOrderTraversal(root.right, result)
    }
    return result
}

export const preOrderTraversal = (root: TreeNode | null, result: number[] = []): number[] => {
    if (root !== null) {
        result.push(root.value)
        preOrderTraversal(root.left, result)
        preOrderTraversal(root.right, result)
    }
    return result
}

export const postOrderTraversal = (root: TreeNode | null, result: number[] = []): number[] => {
    if (root !== null) {
        postOrderTraversal(root.left, result)
        postOrderTraversal(root.right, result)
        result.push(root.value)
    }
    return result
}

// Calcular la altura del árbol
export const getTreeHeight = (root: TreeNode | null): number => {
    if (root === null) {
        return 0
    }
    return Math.max(getTreeHeight(root.left), getTreeHeight(root.right)) + 1
}

// Calcular el ancho máximo del árbol
export const getTreeWidth = (root: TreeNode | null): number => {
    if (root === null) {
        return 0
    }
    const height = getTreeHeight(root)
    let maxWidth = 0

    for (let i = 1; i <= height; i++) {
        const width = getWidthAtLevel(root, i)
        maxWidth = Math.max(maxWidth, width)
    }

    return maxWidth
}

// Obtener el ancho en un nivel específico
export const getWidthAtLevel = (root: TreeNode | null, level: number): number => {
    if (root === null) {
        return 0
    }
    if (level === 1) {
        return 1
    }
    return getWidthAtLevel(root.left, level - 1) + getWidthAtLevel(root.right, level - 1)
}

export interface TreeVisualizationProps {
    initialTree?: number[]
}