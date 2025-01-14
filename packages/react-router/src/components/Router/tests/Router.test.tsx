import React from 'react';
import {BrowserRouter, StaticRouter} from 'react-router-dom';
import {mount} from '@shopify/react-testing';

import Router, {NO_LOCATION_ERROR} from '../Router';

jest.mock('../utilities', () => ({
  isClient: jest.fn(),
}));

const {isClient} = jest.requireMock('../utilities') as {
  isClient: jest.Mock;
};

describe('Router', () => {
  let consoleErrorSpy: jest.SpyInstance;
  let consoleWarnSpy: jest.SpyInstance;

  beforeEach(() => {
    isClient.mockClear();
    isClient.mockImplementation(() => true);

    consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation();
    consoleWarnSpy = jest.spyOn(console, 'warn').mockImplementation();
  });

  afterEach(() => {
    consoleErrorSpy.mockRestore();
    consoleWarnSpy.mockRestore();
  });

  it('renders children', () => {
    const text = 'Hello router';
    const wrapper = mount(<Router>{text}</Router>);

    expect(wrapper).toContainReactText(text);
  });

  it('mounts a BrowserRouter by default', () => {
    const wrapper = mount(<Router />);

    expect(wrapper).toContainReactComponent(BrowserRouter);
  });

  it('mounts a BrowserRouter with basename if provided', () => {
    const basename = '/next';
    const wrapper = mount(<Router basename={basename} />);

    expect(wrapper).toContainReactComponent(BrowserRouter, {basename});
  });

  it('mounts a StaticRouter on the server with the delegated location prop', () => {
    isClient.mockReturnValue(false);

    const location = 'http://www.shopify.com';
    const wrapper = mount(<Router location={location} />);

    expect(wrapper).toContainReactComponent(StaticRouter, {location});
  });

  it('mounts a StaticRouter on the server with basename if provided', () => {
    isClient.mockReturnValue(false);
    const location = 'http://www.shopify.com/next/example';
    const basename = '/next';
    const wrapper = mount(<Router basename={basename} location={location} />);

    expect(wrapper).toContainReactComponent(StaticRouter, {basename, location});
  });

  it('throws a useful error when location is omitted on the server', () => {
    isClient.mockReturnValue(false);

    expect(() => {
      mount(<Router />);
    }).toThrow(NO_LOCATION_ERROR);
  });

  it('mounts a StaticRouter on the server with location string when location passed in is an object', () => {
    isClient.mockReturnValue(false);

    const pathname = '/test123';
    const search = '?test1=value1&test2=value2';
    const location = new URL(`http://www.shopify.com${pathname}${search}`);
    const wrapper = mount(<Router location={location} />);

    expect(wrapper).toContainReactComponent(StaticRouter, {
      location: {pathname, search, hash: '', state: undefined},
    });
  });
});
