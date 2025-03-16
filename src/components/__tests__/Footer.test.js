import { render, screen } from "@testing-library/react";
import Footer from "../Footer"; // Adjusted the path

test("renders the footer with correct text", () => {
  render(<Footer />);
  
  // Check if the copyright text is displayed
  const footerText = screen.getByText(/© EMS. All rights reserved./i);
  expect(footerText).toBeInTheDocument();
});

test("footer has correct background color", () => {
  const { container } = render(<Footer />);
  
  // Check if the footer has the correct inline background style
  expect(container.querySelector("footer")).toHaveStyle("background-color: #00468b");
});
