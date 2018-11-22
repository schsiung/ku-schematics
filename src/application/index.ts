import {
  Rule,
  Tree,
  SchematicContext,
  chain,
  noop,
  mergeWith,
  apply,
  url,
  template,
  move,
  filter,
  MergeStrategy,
} from '@angular-devkit/schematics';
import { strings } from '@angular-devkit/core';
import { NodePackageInstallTask } from '@angular-devkit/schematics/tasks';
import * as path from 'path';
const fs = require('fs');

import { Schema as ApplicationOptions } from './schema';
import {
  addPackageToPackageJson,
  getPackage,
  overwritePackage,
  getJSON,
  overwriteJSON,
  scriptsToAngularJson,
} from '../utils/json';
import { addFiles } from '../utils/file';
import { Project, getProject } from '../utils/project';
import { addHeadStyle, addHtmlToBody } from '../utils/html';
import { tryAddFile } from '../utils/alain';
import { HMR_CONTENT } from '../utils/contents';

const overwriteDataFileRoot = path.join(__dirname, 'overwrites');
let project: Project;

/** Remove files to be overwrite */
function removeOrginalFiles() {
  console.log(`${project.root}/README.md`);
  console.log(`${project.sourceRoot}/environments/environment.prod.ts`);
  debugger
  return (host: Tree) => {
    [
      `${project.root}/README.md`,
      `${project.sourceRoot}/main.ts`,
      `${project.sourceRoot}/index.html`,
      `${project.sourceRoot}/karma.conf.js`,
      `${project.sourceRoot}/polyfills.ts`,
      `${project.sourceRoot}/test.ts`,
      `${project.sourceRoot}/tsconfig.app.json`,
      `${project.sourceRoot}/tsconfig.spec.json`,
      `${project.sourceRoot}/environments/environment.prod.ts`,
      `${project.sourceRoot}/environments/environment.ts`,
      `${project.sourceRoot}/styles.less`,
      `${project.sourceRoot}/app/app.module.ts`,
      `${project.sourceRoot}/app/app.component.spec.ts`,
      `${project.sourceRoot}/app/app.component.ts`,
      `${project.sourceRoot}/app/app.component.html`,
      `${project.sourceRoot}/app/app.component.less`,
    ]
      .filter(p => host.exists(p))
      .forEach(p => host.delete(p));
  };
}



function patchPackageJson(options: ApplicationOptions) {
  return (host: Tree, context: SchematicContext) => {
    // For package.json, we simply add or relace the following fields
    const jobs = ["scripts", "dependencies", "devDependencies", "lint-staged"];
    const json = getPackage(host);

    const jsonTpl = require('./files/root/package.json');
    jobs.forEach(field => {
      // How to fetch the field from jsonTpl? question remained!!
      json[field] = jsonTpl[field];
    })

    overwritePackage(host, json);
    return host;
  };
}


function addPathsToTsConfig() {
  return (host: Tree, context: SchematicContext) => {
    [
      {
        path: 'tsconfig.json',
        baseUrl: `${project.sourceRoot}/`,
      },
      {
        path: `${project.sourceRoot}/tsconfig.app.json`,
        baseUrl: './',
      },
      {
        path: `${project.sourceRoot}/tsconfig.spec.json`,
        baseUrl: './',
      },
    ].forEach(item => {
      const json = getJSON(host, item.path, 'compilerOptions');
      if (json == null) return host;
      if (!json.compilerOptions) json.compilerOptions = {};
      if (!json.compilerOptions.paths) json.compilerOptions.paths = {};
      json.compilerOptions.baseUrl = item.baseUrl;
      const paths = json.compilerOptions.paths;
      paths['@shared'] = ['app/shared'];
      paths['@shared/*'] = ['app/shared/*'];
      paths['@core'] = ['app/core'];
      paths['@core/*'] = ['app/core/*'];
      paths['@testing'] = ['testing'];
      paths['@testing/*'] = ['testing/*'];
      paths['@env'] = ['environments'];
      paths['@env/*'] = ['environments/*'];
      overwriteJSON(host, item.path, json);
    });
    return host;
  };
}



function patchAngularJson() {
  return (host: Tree, context: SchematicContext) => {
    const angularJsonFile = 'angular.json';
    const json = getJSON(host, angularJsonFile, 'schematics');
    if (json == null) return host;
    // Do as follows:
    // 1.styles paths should be changed to "src/assets/styles/styles.less"
    // 2.assets paths should be changed 
    // 3.local build environment should be added
    const jsonTpl = require('./files/root/angular.json');

    const projectName = project.name;
    const tplName = "ku-ng-startup";

    json["projects"][projectName]["architect"]["build"]["options"]["assets"] = jsonTpl["projects"][tplName]["architect"]["build"]["options"]["assets"];
    json["projects"][projectName]["architect"]["build"]["options"]["styles"] = jsonTpl["projects"][tplName]["architect"]["build"]["options"]["styles"];

    json["projects"][projectName]["architect"]["build"]["configurations"]["local"] = jsonTpl["projects"][tplName]["architect"]["build"]["configurations"]["local"];
    json["projects"][projectName]["architect"]["serve"]["configurations"]["local"] = jsonTpl["projects"][tplName]["architect"]["serve"]["configurations"]["local"];

    json["projects"][projectName]["architect"]["test"]["options"]["styles"] = jsonTpl["projects"][tplName]["architect"]["test"]["options"]["styles"];

    overwriteJSON(host, angularJsonFile, json);
    return host;
  };
}




function addFilesToRoot(options: ApplicationOptions) {
  return chain([
    mergeWith(
      apply(url('./files/src'), [
        options.i18n ? noop() : filter(p => p.indexOf('i18n') === -1),
        options.form ? noop() : filter(p => p.indexOf('json-schema') === -1),
        template({
          ...strings,
          ...options,
        }),
        move(`${project.sourceRoot}/`),
      ]),
      MergeStrategy.Overwrite
    ),
    // mergeWith(
    //   apply(url('./files/root'), [
    //     options.i18n ? noop() : filter(p => p.indexOf('i18n') === -1),
    //     options.form ? noop() : filter(p => p.indexOf('json-schema') === -1),
    //     template({
    //       ...strings,
    //       ...options,
    //     }),
    //     move('/')
    //   ]),
    //   MergeStrategy.Overwrite,
    // ),
  ]);
}

function installPackages() {
  return (host: Tree, context: SchematicContext) => {
    context.addTask(new NodePackageInstallTask());
  };
}

export default function (options: ApplicationOptions): Rule {
  return (host: Tree, context: SchematicContext) => {
    project = getProject(host, options.project);

    return chain([
      patchPackageJson(options),

      patchAngularJson(),

      // files
      removeOrginalFiles(),
      addFilesToRoot(options),

      installPackages(),
    ])(host, context);
  };
}
