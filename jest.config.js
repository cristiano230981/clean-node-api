module.exports = {
  roots: ['<rootDir>/src'],
  collectCoverageFrom: ['<rootDir>/src/**/*.ts'],
  coverageDirectory: "coverage",
  transform: {
   '.+\\.ts$' : 'ts-jest'
  },
  coveragePathIgnorePatterns: [
    'index.ts',
    'signup-protocols.ts',
    'db-add-account-protocols.ts'
  ]
};
