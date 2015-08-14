module.exports.getSelector = function (ruleset) {
  var selector = '';

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
