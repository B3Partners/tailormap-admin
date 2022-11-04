import { render, screen } from '@testing-library/angular';
import { ComponentsConfigPageComponent } from './components-config-page.component';

describe('ComponentsConfigComponent', () => {

  test('should render', async () => {
    await render(ComponentsConfigPageComponent);
    expect(screen.getByText('components-config works!'));
  });

});
