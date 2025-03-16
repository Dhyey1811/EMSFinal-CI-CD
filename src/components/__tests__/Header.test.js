import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import Header from "../Header";

test("renders navigation links", () => {
  render(
    <MemoryRouter>
      <Header />
    </MemoryRouter>
  );

  // Search for links instead of buttons
  const homeLink = screen.getByRole("link", { name: /home/i });
  const createEmployeeLink = screen.getByRole("link", { name: /create employee/i });

  expect(homeLink).toBeInTheDocument();
  expect(createEmployeeLink).toBeInTheDocument();
});

