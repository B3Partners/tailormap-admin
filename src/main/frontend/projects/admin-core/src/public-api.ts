/*
 * Public API Surface of core
 */
/// <reference path="typings.d.ts" />

if (typeof window.$localize === 'undefined') {
  window.$localize = (messageParts: TemplateStringsArray) => messageParts.join('');
}

export * from './lib/admin-core.module';
export * from './lib/pages';
