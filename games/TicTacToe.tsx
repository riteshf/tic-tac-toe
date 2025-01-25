import React, { useState } from "react";
import { StyleSheet, View, Text, TouchableOpacity, Alert } from "react-native";

type Board = any[];

const TicTacToe = () => {
  const [board, setBoard] = useState(Array(9).fill(null));
  const [isXNext, setIsXNext] = useState(true);
  const [winner, setWinner] = useState<string | null>(null);

  const handlePress = (index: number) => {
    if (board[index] || winner) return; // If already filled or winner exists
    const newBoard = [...board];
    newBoard[index] = isXNext ? "X" : "O";
    setBoard(newBoard);
    setIsXNext(!isXNext);
    checkWinner(newBoard);
  };

  const checkWinner = (board: Board) => {
    const winPatterns = [
      [0, 1, 2],
      [3, 4, 5],
      [6, 7, 8],
      [0, 3, 6],
      [1, 4, 7],
      [2, 5, 8],
      [0, 4, 8],
      [2, 4, 6],
    ];

    for (let pattern of winPatterns) {
      const [a, b, c] = pattern;
      if (board[a] && board[a] === board[b] && board[a] === board[c]) {
        setWinner(board[a]);
        Alert.alert("Game Over", `Winner: ${board[a]}`);
        return;
      }
    }

    if (!board.includes(null)) {
      setWinner("Draw");
      Alert.alert("Game Over", "It's a Draw!");
    }
  };

  const resetGame = () => {
    setBoard(Array(9).fill(null));
    setIsXNext(true);
    setWinner(null);
  };

  const renderSquare = (index: number) => (
    <TouchableOpacity
      style={styles.square}
      onPress={() => handlePress(index)}
      accessibilityLabel={`Square ${index + 1}`}
      accessibilityRole="button"
    >
      <Text style={styles.text}>{board[index]}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Tic Tac Toe</Text>
      <View style={styles.board}>
        {[0, 1, 2].map((row) => (
          <View style={styles.row} key={row}>
            {renderSquare(row * 3)}
            {renderSquare(row * 3 + 1)}
            {renderSquare(row * 3 + 2)}
          </View>
        ))}
      </View>
      {winner && (
        <Text style={styles.winnerText}>
          {winner === "Draw" ? "It's a Draw!" : `Winner: ${winner}`}
        </Text>
      )}
      <TouchableOpacity style={styles.resetButton} onPress={resetGame}>
        <Text style={styles.resetText}>Reset Game</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f5f5f5",
    padding: 20,
  },
  title: {
    fontSize: 32,
    fontWeight: "bold",
    marginBottom: 20,
    color: "#333",
  },
  board: {
    width: 300,
    height: 300,
    justifyContent: "center",
    backgroundColor: "#fff",
    borderRadius: 10,
    elevation: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  row: {
    flexDirection: "row",
  },
  square: {
    width: 100,
    height: 100,
    borderWidth: 1,
    borderColor: "#000",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#e0e0e0",
  },
  text: {
    fontSize: 32,
    fontWeight: "bold",
    color: "#333",
  },
  winnerText: {
    fontSize: 24,
    fontWeight: "bold",
    color: "green",
    marginTop: 20,
  },
  resetButton: {
    marginTop: 20,
    padding: 10,
    backgroundColor: "#6200ee",
    borderRadius: 5,
  },
  resetText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
    width: 200,
    textAlign: "center",
    padding: 5,
  },
});

export default TicTacToe;