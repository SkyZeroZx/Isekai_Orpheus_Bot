import { ComponentsModule } from './components.module';

fdescribe('ComponentsModule', () => {
  let componentsModule: ComponentsModule;

  beforeEach(() => {
    componentsModule = new ComponentsModule();
  });

  it('ComponentsModule creado correctamente', () => {
    expect(componentsModule).toBeTruthy();
  });
});
