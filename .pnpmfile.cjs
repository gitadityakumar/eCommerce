module.exports = {
  hooks: {
    readPackage(pkg, _context) {
      const needsTsApi = pkg.name?.startsWith('@typescript-eslint/')
        || pkg.name === 'eslint-plugin-perfectionist';
      if (needsTsApi) {
        delete pkg.peerDependencies?.typescript;
        delete pkg.peerDependenciesMeta?.typescript;
        pkg.dependencies = { ...pkg.dependencies, typescript: '5.9.3' };
      }
      return pkg;
    },
  },
};
