const config = {
  importOrder: ["<THIRD_PARTY_MODULES>", "^@/", "^[.]"],
  plugins: ["@prettier/plugin-oxc", "@ianvs/prettier-plugin-sort-imports"],
  printWidth: 120,
  semi: false,
}

export default config
