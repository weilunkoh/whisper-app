import { render, screen } from '@testing-library/react'
import SubmitButton from '../../components/submitButton';

test("Submit button renders successfully", () => {
  render(<SubmitButton displayText="Submit" />);

  const element = screen.getByText(/submit/i);

  expect(element).toBeInTheDocument();
})