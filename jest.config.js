module.exports = {
  roots: ['<rootDir>/src'],
  collectCoverageFrom: ['<rootDir>/src/**/*.ts',
  '!<rootDir>/src/main/**'],
  coverageDirectory: "coverage",
  transform: {
   '.+\\.ts$' : 'ts-jest'
  },
  coveragePathIgnorePatterns: [
    'index.ts',
    '-protocols.ts'
  ],
  preset: '@shelf/jest-mongodb'
};
