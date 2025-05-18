import { render } from '@testing-library/react';
import '@testing-library/jest-dom';

test('renders root', () => {
  const { baseElement } = render(<div />);
  expect(baseElement).toBeTruthy();
});
