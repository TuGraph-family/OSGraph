export const makeVarCss = (css: object) =>
  Object.entries(css).reduce(
    (cssTheme, [key, value]) => ({
      ...cssTheme,
      [`--${key}`]: value,
    }),
    {}
  );
