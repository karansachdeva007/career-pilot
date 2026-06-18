# Graphs: DSA Guide

## Overview
Graphs are non-linear data structures consisting of vertices (nodes) and edges. They are incredibly versatile and model real-world networks like social connections, maps, and web pages.

## Key Concepts
- **Representations**: Adjacency Matrix (dense graphs) and Adjacency List (sparse graphs).
- **Traversals**:
  - **Breadth-First Search (BFS)**: Uses a queue. Great for finding the shortest path in an unweighted graph.
  - **Depth-First Search (DFS)**: Uses a stack (or recursion). Good for exploring all paths, cycle detection, and topological sorting.
- **Cycle Detection**:
  - Undirected: Use BFS/DFS and track the parent.
  - Directed: Use DFS and track the recursion stack (colors).
- **Shortest Path Algorithms**:
  - Dijkstra's Algorithm (weighted, non-negative)
  - Bellman-Ford (handles negative weights)
- **Minimum Spanning Tree (MST)**: Prim's and Kruskal's algorithms.

## Common Patterns
- **Topological Sort**: Used for scheduling tasks with dependencies.
- **Bipartite Graph Check**: Coloring nodes with two colors using BFS/DFS.
- **Island Problems**: Treating a 2D matrix as a graph and finding connected components.
