/* eslint-disable @typescript-eslint/no-require-imports, no-undef */
const { getDefaultConfig } = require('expo/metro-config')
const path = require('path')

const projectRoot = __dirname
const monorepoRoot = path.resolve(projectRoot, '../..')

const config = getDefaultConfig(projectRoot)

// Watch all files in the monorepo so Metro picks up workspace packages
config.watchFolders = [monorepoRoot]

// Resolve packages from the monorepo root first, then the project root.
config.resolver.nodeModulesPaths = [
  path.resolve(monorepoRoot, 'node_modules'),
  path.resolve(projectRoot, 'node_modules'),
]

// Force all react/react-native imports across workspace packages to resolve
// to the app's single copy. extraNodeModules is only a fallback and won't
// override packages that have their own node_modules/react (e.g. packages/hooks).
const reactPath = path.resolve(projectRoot, 'node_modules/react')
const reactNativePath = path.resolve(projectRoot, 'node_modules/react-native')
const reactDomPath = path.resolve(projectRoot, 'node_modules/react-dom')

config.resolver.resolveRequest = (context, moduleName, platform) => {
  if (moduleName === 'react') {
    return { filePath: path.join(reactPath, 'index.js'), type: 'sourceFile' }
  }
  if (moduleName === 'react-native') {
    return {
      filePath: path.join(reactNativePath, 'index.js'),
      type: 'sourceFile',
    }
  }
  if (moduleName === 'react-dom') {
    return { filePath: path.join(reactDomPath, 'index.js'), type: 'sourceFile' }
  }
  return context.resolveRequest(context, moduleName, platform)
}

module.exports = config
