import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Animated,
} from "react-native";

import { SafeAreaView } from "react-native-safe-area-context";

type Player = "X" | "O" | null;

type BoardState = Player[];

const getLineStyle = (combination: number[]) => {
  const lines = {
    horizontal: [
      { top: 50, left: 0, width: 300, height: 6 },
      { top: 150, left: 0, width: 300, height: 6 },
      { top: 250, left: 0, width: 300, height: 6 },
    ],
    vertical: [
      { top: 0, left: 50, width: 6, height: 300 },
      { top: 0, left: 150, width: 6, height: 300 },
      { top: 0, left: 250, width: 6, height: 300 },
    ],
    diagonal: [
      {
        top: 150,
        left: -61,
        width: 424,
        height: 6,
        transform: [{ rotate: "45deg" }],
      },
      {
        top: 150,
        left: -61,
        width: 424,
        height: 6,
        transform: [{ rotate: "-45deg" }],
      },
    ],
  };

  if (combination[0] === 0 && combination[1] === 1 && combination[2] === 2) {
    return lines.horizontal[0];
  } else if (
    combination[0] === 3 &&
    combination[1] === 4 &&
    combination[2] === 5
  ) {
    return lines.horizontal[1];
  } else if (
    combination[0] === 6 &&
    combination[1] === 7 &&
    combination[2] === 8
  ) {
    return lines.horizontal[2];
  } else if (
    combination[0] === 0 &&
    combination[1] === 3 &&
    combination[2] === 6
  ) {
    return lines.vertical[0];
  } else if (
    combination[0] === 1 &&
    combination[1] === 4 &&
    combination[2] === 7
  ) {
    return lines.vertical[1];
  } else if (
    combination[0] === 2 &&
    combination[1] === 5 &&
    combination[2] === 8
  ) {
    return lines.vertical[2];
  } else if (
    combination[0] === 0 &&
    combination[1] === 4 &&
    combination[2] === 8
  ) {
    return lines.diagonal[0];
  } else if (
    combination[0] === 2 &&
    combination[1] === 4 &&
    combination[2] === 6
  ) {
    return lines.diagonal[1];
  }
  return {};
};

const TicTacToe: React.FC = () => {
  const [board, setBoard] = useState<BoardState>(Array(9).fill(null));
  const [isXTurn, setIsXTurn] = useState(true);
  const [winner, setWinner] = useState<Player | "Draw" | null>(null);
  const [winningCombination, setWinningCombination] = useState<number[] | null>(
    null
  );
  const scaleAnim = new Animated.Value(1);

  const checkWinner = (newBoard: BoardState): Player | "Draw" | null => {
    const winningCombinations = [
      [0, 1, 2],
      [3, 4, 5],
      [6, 7, 8],
      [0, 3, 6],
      [1, 4, 7],
      [2, 5, 8],
      [0, 4, 8],
      [2, 4, 6],
    ];

    for (let combo of winningCombinations) {
      const [a, b, c] = combo;
      if (
        newBoard[a] &&
        newBoard[a] === newBoard[b] &&
        newBoard[a] === newBoard[c]
      ) {
        setWinningCombination(combo);
        return newBoard[a];
      }
    }
    return newBoard.includes(null) ? null : "Draw";
  };

  const handlePress = (index: number) => {
    if (board[index] || winner) return;

    const newBoard = [...board];
    newBoard[index] = isXTurn ? "X" : "O";
    setBoard(newBoard);
    setIsXTurn(!isXTurn);
    setWinner(checkWinner(newBoard));

    Animated.sequence([
      Animated.timing(scaleAnim, {
        toValue: 1.2,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.timing(scaleAnim, {
        toValue: 1,
        duration: 100,
        useNativeDriver: true,
      }),
    ]).start();
  };

  const resetGame = () => {
    setBoard(Array(9).fill(null));
    setIsXTurn(true);
    setWinner(null);
    setWinningCombination(null);
  };

  const renderCell = (index: number) => (
    <TouchableOpacity
      key={index}
      style={styles.cell}
      onPress={() => handlePress(index)}
    >
      <View style={styles.cellBorder}>
        <Animated.View style={{ transform: [{ scale: scaleAnim }] }}>
          {board[index] && (
            <Text
              style={[
                styles.cellText,
                { color: board[index] === "X" ? "#3c4043" : "#fff" },
              ]}
            >
              {board[index]}
            </Text>
          )}
        </Animated.View>
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.status}>
        {winner
          ? winner === "Draw"
            ? "It's a Draw!"
            : `${winner} Wins!`
          : `Turn: ${isXTurn ? "X" : "O"}`}
      </Text>
      <View style={styles.board}>
        {board.map((_, index) => renderCell(index))}
        {winningCombination && (
          <View style={styles.lineContainer}>
            <Animated.View
              style={[styles.line, getLineStyle(winningCombination), {
                backgroundColor: winner === 'X' ? '#3c4043' : '#fff',
              }]}
            />
          </View>
        )}
      </View>
      <TouchableOpacity style={styles.resetButton} onPress={resetGame}>
        <Text style={styles.resetText}>Reset Game</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0ca192",
    justifyContent: "center",
    alignItems: "center",
  },
  status: {
    fontSize: 26,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 20,
  },
  board: {
    width: 300,
    height: 300,
    flexDirection: "row",
    flexWrap: "wrap",
    position: "relative",
  },
  cell: {
    width: 100,
    height: 100,
    justifyContent: "center",
    alignItems: "center",
  },
  cellBorder: {
    width: '100%',
    height: '100%',
    borderWidth: 4,
    borderColor: "teal",
    justifyContent: "center",
    alignItems: "center",
  },
  cellText: {
    fontSize: 48,
    fontWeight: "bold",
  },
  resetButton: {
    marginTop: 30,
    width: 250,
    justifyContent: "center",
    textAlign: "center",
    padding: 16,
    backgroundColor: "#3c4043",
    borderRadius: 10,
  },
  resetText: {
    color: "#fff",
    fontSize: 20,
    fontWeight: "bold",
    margin: "auto",
  },
  lineContainer: {
    position: "absolute",
    top: 0,
    left: 0,
    width: 300,
    height: 300,
    justifyContent: "center",
    alignItems: "center",
  },
  line: {
    position: "absolute",
    backgroundColor: "#3c4043",
  },
});

export default TicTacToe;
