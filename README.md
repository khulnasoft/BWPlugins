# BWPlugins

[![Build Status](https://github.com/KhulnaSoft/BWPlugins/workflows/build/badge.svg?branch=master&event=push)](https://github.com/KhulnaSoft/BWPlugins/actions?query=workflow%3Abuild+branch%3Amaster)

The suite of tools that are run in the KhulnaSoft Framework
Benchmarks. This application is a stand-alone executable which orchestrates
several functions: auditing existing test implementations, running benchmarks, 
running test implementation verifications, etc.

The goal of this application is to live in isolation from the test 
implementations. Separately, the executable that is built from this toolset
will execute against the test implementations as local data.
