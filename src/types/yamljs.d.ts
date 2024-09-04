declare module 'yamljs' {
    interface YAML {
      load(path: string): any;
    }
  
    const yaml: YAML;
    export default yaml;
  }
  