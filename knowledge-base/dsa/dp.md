# Dynamic Programming (DP): DSA Guide

## Overview
Dynamic Programming is a method for solving complex problems by breaking them down into simpler subproblems. It is applicable when the subproblems overlap and optimal solutions to subproblems contribute to the optimal solution of the overall problem.

## Core Properties
1. **Overlapping Subproblems**: The problem can be broken down into subproblems which are reused several times.
2. **Optimal Substructure**: The optimal solution to the problem can be constructed from optimal solutions of its subproblems.

## Approaches
- **Top-Down (Memoization)**: Write the recursive solution and cache the results of subproblems. Easy to write if you understand the recursive tree.
- **Bottom-Up (Tabulation)**: Build a table iteratively from the smallest subproblems up to the main problem. Often more memory efficient (especially with space optimization).

## Common Patterns
- **1D DP**: Fibonacci, Climbing Stairs, House Robber.
- **2D DP**: Longest Common Subsequence, Edit Distance, Grid path finding.
- **0/1 Knapsack**: Bounded selection to maximize value.
- **Unbounded Knapsack**: Coin Change.

## Tips
- Always start by defining the state (e.g., what does `dp[i]` represent?).
- Write down the state transition equation.
- Identify the base cases clearly.
