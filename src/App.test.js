import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import App from './App';

test('renders Start Game button', () => {
  render(<App />);
  const startButton = screen.getByText(/Start Game/i);
  expect(startButton).toBeInTheDocument();
});

test('renders React Snake Demo title and score', () => {
  render(<App />);
  expect(screen.getByText(/React Snake Demo/i)).toBeInTheDocument();
  expect(screen.getByText(/Score:/i)).toBeInTheDocument();
});

test('starts game and shows snake and food', async () => {
  render(<App />);
  
  // Click the Start Game button
  const startButton = screen.getByLabelText('start-game');
  fireEvent.click(startButton);

  // Wait for snake segment and food to appear
  const snake = await screen.findAllByRole('snake-segment');
  const food = await screen.findByRole('food');

  expect(snake.length).toBeGreaterThan(0);
  expect(food).toBeInTheDocument();
});

test('triggers game over and displays overlay', async () => {
  render(<App />);

  // Start the game
  const startButton = screen.getByLabelText('start-game');
  fireEvent.click(startButton);

  // Wait enough time for collision (depends on your game settings)
  await waitFor(() =>
    expect(screen.getByTestId('game-over-message')).toBeInTheDocument(),
    { timeout: 5000 }
  );
});