import { render, screen } from '@testing-library/react'
import Body from '../../components/bodyDisplay'

test("Body renders successfully", () => {
  render(<Body>Sample Text</Body>);

  const element = screen.getByText(/sample text/i);

  expect(element).toBeInTheDocument();
})