function getAtRule (atruleb) {
  var selector = '';

  atruleb.content.forEach(function (selectorComponent){
    if (selectorComponent.type === 'block'){
      return;
    }

    if (typeof selectorComponent.content === 'string') {
      return selector += selectorComponent.content;
    }

    if (selectorComponent.type === 'atkeyword' && selectorComponent.contains('ident')){
      return selector += '@' + selectorComponent.first('ident').content;
    }

    if (selectorComponent.type === 'parentheses'){
      selectorComponent.content.forEach(function (parenthesesComponent){
        if (typeof parenthesesComponent.content === 'string') {
          return selector += parenthesesComponent.content;
        }

        if (parenthesesComponent.type === 'dimension'){
          parenthesesComponent.content.forEach(function (dimensionComponent){
            if (typeof dimensionComponent.content === 'string'){
              selector += dimensionComponent.content;
            }
          });
        }
      });
    }
  });

  return selector.trim();
}

module.exports.getConcatSelector = function (ruleset) {
  var selector = '';

  if (ruleset.first('atkeyword')){
    return getAtRule(ruleset);
  }

  ruleset.first('selector').forEach('simpleSelector', function (simpleSelector){
    simpleSelector.content.forEach(function (selectorComponent){

      if (typeof selectorComponent.content === 'string') {
        return selector += selectorComponent.content;
      }

      if (selectorComponent.type === 'id' && selectorComponent.contains('ident')) {
        return selector += '#' + selectorComponent.first('ident').content;
      }

      if (selectorComponent.type === 'id' && selectorComponent.contains('interpolation')) {
        return selector += '##{' + selectorComponent.first('interpolation').content + '}';
      }

      if (selectorComponent.type === 'class' && selectorComponent.contains('ident')) {
        return selector += '.' + selectorComponent.first('ident').content;
      }

      if (selectorComponent.type === 'class' && selectorComponent.contains('interpolation')) {
        return selector += '.#{' + selectorComponent.first('interpolation').content + '}';
      }

      if (selectorComponent.type === 'pseudoClass') {
        return selector += ':' + selectorComponent.first('ident').content;
      }
    });
  });

  selector = selector.replace(/(\r\n|\n|\r)/gm,"");
  selector = selector.replace(/\s\s+/g, ' ');

  return selector.trim();
};
