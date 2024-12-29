import { render, screen } from '@testing-library/react'
import Body from '../../components/bodyDisplay'

test("Body renders successfully", () => {
  render(<Body>Sample 1</Body>);

  const element = screen.getByText(/sample 1/i);

  expect(element).toBeInTheDocument();
})