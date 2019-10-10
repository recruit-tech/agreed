import * as ts from "typescript";
import * as TJS from "typescript-json-schema";

export interface Spec {
  name: string;
  path: string[];
  doc: object;
  schema: TJS.Definition;
}

export function generateSchema(fileNames, meta): Spec[] {
  const settings: TJS.PartialArgs = { required: true, ignoreErrors: true };
  const compilerOptions: TJS.CompilerOptions = {
    noEmit: true,
    noEmitOnError: false,
    emitDecoratorMetadata: true,
    experimentalDecorators: true,
    target: ts.ScriptTarget.ES5,
    module: ts.ModuleKind.CommonJS,
    allowUnusedLabels: true
  };

  const host = ts.createCompilerHost(compilerOptions);
  const orgSourceFile = host.getSourceFile;
  host.getSourceFile = (
    fileName: string,
    languageVersion: ts.ScriptTarget,
    onError?: (message: string) => void,
    shouldCreateNewSourceFile?: boolean
  ): ts.SourceFile | undefined => {
    const src = orgSourceFile(
      fileName,
      languageVersion,
      onError,
      shouldCreateNewSourceFile
    );
    const result = ts.transform(src, [
      transformPropertySignature,
      transformTypeReferenceNode,
      transformCaptureTypeArguments
    ]);
    result.dispose();
    return result.transformed[0] as ts.SourceFile;
  };
  host.getSourceFileByPath = undefined;

  const program = ts.createProgram(fileNames, compilerOptions, host);

  const generator = TJS.buildGenerator(program, settings);
  return meta.map(m => {
    return {
      ...m,
      schema: generator.getSchemaForSymbol(m.name)
    };
  });
}

// PropertyとしてPlaceholderを使う場合
const transformPropertySignature = <T extends ts.Node>(
  context: ts.TransformationContext
) => (rootNode: T) => {
  function visit(node: ts.Node): ts.Node {
    node = ts.visitEachChild(node, visit, context);
    if (!ts.isPropertySignature(node)) {
      return node;
    }
    const ps = node as ts.PropertySignature;
    if (!ps.type || !ts.isTypeReferenceNode(ps.type)) {
      return node;
    }
    const tr = ps.type as ts.TypeReferenceNode;
    if ((tr.typeName as any).escapedText === "Placeholder") {
      ps.type = tr.typeArguments[0];
    }
    return node;
  }
  return ts.visitNode(rootNode, visit);
};

// 型パラメータにPlaceholderを使う場合
const transformTypeReferenceNode = <T extends ts.Node>(
  context: ts.TransformationContext
) => (rootNode: T) => {
  function visit(node: ts.Node): ts.Node {
    node = ts.visitEachChild(node, visit, context);
    if (!ts.isTypeReferenceNode(node)) {
      return node;
    }
    const tr = node as ts.TypeReferenceNode;
    if (!tr.typeArguments) {
      return tr;
    }
    const args = tr.typeArguments.map(ta => {
      if (!ts.isTypeReferenceNode(ta)) {
        return ta;
      }
      const tref = ta as ts.TypeReferenceNode;
      if ((tref.typeName as any).escapedText === "Placeholder") {
        return tref.typeArguments[0];
      }
      return tref;
    }) as any;
    tr.typeArguments = args;
    return tr;
  }
  return ts.visitNode(rootNode, visit);
};

const transformCaptureTypeArguments = <T extends ts.Node>(
  context: ts.TransformationContext
) => (rootNode: T) => {
  function visit(node: ts.Node): ts.Node {
    node = ts.visitEachChild(node, visit, context);
    if (!ts.isTupleTypeNode(node)) {
      return node;
    }
    const tp = node as ts.TupleTypeNode;
    const et: ts.NodeArray<ts.TypeNode> = tp.elementTypes.map(e => {
      if (!ts.isTypeReferenceNode(e)) {
        return e;
      }
      if (
        (e.typeName as ts.Identifier).escapedText === "Capture" &&
        e.typeArguments.length === 2
      ) {
        return e.typeArguments[1];
      }

      return e;
    }) as any;
    tp.elementTypes = et;
    return tp;
  }
  return ts.visitNode(rootNode, visit);
};
