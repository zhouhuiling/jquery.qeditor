// Generated by CoffeeScript 1.7.1

/*
jquery.qeditor
==============

This is a simple WYSIWYG editor with jQuery, Bootstrap3.1, font-awesome.

 *# Author:

    Jason Lee <huacnlee@gmail.com>

 *# Requirements:

    [jQuery](http://jquery.com)
    (Font-Awesome)[http://fortawesome.github.io/Font-Awesome/] - Toolbar icons

 *# Usage:

    $("textarea").qeditor();

and then you need filt the html tags,attributes in you content page.
In Rails application, you can use like this:

    <%= sanitize(@post.body,:tags => %w(strong b i u strike ol ul li address blockquote pre code br div p), :attributes => %w(src)) %>
 */
var QEDITOR_ALLOW_TAGS_ON_PASTE, QEDITOR_DISABLE_ATTRIBUTES_ON_PASTE, QEDITOR_TOOLBAR_HTML;

QEDITOR_TOOLBAR_HTML = "<div class=\"btn-toolbar qeditor_toolbar\" role=\"toolbar\">\n  <div class=\"btn-group\">\n    <button type=\"button\" data-action=\"bold\" class=\"btn btn-default btn-sm qe-bold\" title=\"Bold\" data-toggle=\"tooltip\"><i class=\"fa fa-bold\"></i></button>\n    <button type=\"button\" data-action=\"italic\" class=\"btn btn-default btn-sm qe-italic\" title=\"Italic\" data-toggle=\"tooltip\"><i class=\"fa fa-italic\"></i></button>\n    <button type=\"button\" data-action=\"underline\" class=\"btn btn-default btn-sm qe-underline\" title=\"Underline\" data-toggle=\"tooltip\"><i class=\"fa fa-underline\"></i></button>\n    <button type=\"button\" data-action=\"strikethrough\" class=\"btn btn-default btn-sm qe-strikethrough\" title=\"Strike-through\" data-toggle=\"tooltip\"><i class=\"fa fa-strikethrough\"></i></button>\n    <div class=\"btn-group qe-heading\">\n      <button type=\"button\" class=\"btn btn-default btn-sm dropdown-toggle\" data-toggle=\"dropdown\" title=\"Heading\">\n        <i class=\"fa fa-font\"></i>\n      </button>\n      <ul class=\"dropdown-menu qe-menu\" role=\"menu\">\n        <li><a href=\"#\" data-name=\"h2\" class=\"qe-h2\">Large</a></li>\n        <li><a href=\"#\" data-name=\"h3\" class=\"qe-h3\">Medium</a></li>\n        <li><a href=\"#\" data-name=\"h4\" class=\"qe-h4\">Small</a></li>\n        <li><a href=\"#\" data-name=\"p\" class=\"qe-p\">Normal</a></li>\n      </ul>\n    </div>\n    <button type=\"button\" data-action=\"insertorderedlist\" class=\"btn btn-default btn-sm qe-ol\" title=\"Insert Ordered-list\" data-toggle=\"tooltip\"><i class=\"fa fa-list-ol\"></i></button>\n    <button type=\"button\" data-action=\"insertunorderedlist\" class=\"btn btn-default btn-sm qe-ul\" title=\"Insert Unordered-list\" data-toggle=\"tooltip\"><i class=\"fa fa-list-ul\"></i></button>\n    <button type=\"button\" data-action=\"insertHorizontalRule\" class=\"btn btn-default btn-sm qe-hr\" title=\"Insert Horizontal Rule\" data-toggle=\"tooltip\"><i class=\"fa fa-minus\"></i></button>\n    <button type=\"button\" data-action=\"blockquote\" class=\"btn btn-default btn-sm qe-blockquote\" title=\"Blockquote\" data-toggle=\"tooltip\"><i class=\"fa fa-quote-left\"></i></button>\n    <button type=\"button\" data-action=\"pre\" class=\"btn btn-default btn-sm qe-pre\" title=\"Pre\" data-toggle=\"tooltip\"><i class=\"fa fa-code\"></i></button>\n    <button type=\"button\" data-action=\"createLink\" class=\"btn btn-default btn-sm qe-link\" data-toggle=\"popover\" title=\"Create Link\"><i class=\"fa fa-link\"></i></button>\n    <button type=\"button\" data-action=\"insertimage\" class=\"btn btn-default btn-sm qe-image\" data-toggle=\"popover\" title=\"Insert Image\"><i class=\"fa fa-picture-o\"></i></button>\n  </div>\n  <div class=\"btn-group pull-right\">\n    <button type=\"button\" data-action=\"removeFormat\" class=\"btn btn-default btn-sm\" title=\"Remove format\" data-toggle=\"tooltip\"><i class=\"fa fa-eraser\"></i></button>\n    <button type=\"button\" onclick=\"return QEditor.toggleFullScreen(this);\" class=\"btn btn-default btn-sm qe-fullscreen\" title=\"Toggle Fullscreen\" data-toggle=\"tooltip\"><i class=\"fa fa-arrows-alt\"></i></button>\n  </div>\n</div>";

QEDITOR_ALLOW_TAGS_ON_PASTE = "a,div,p,ul,ol,li,hr,br,b,strong,i,em,img,h1,h2,h3,h4,h5,h6";

QEDITOR_DISABLE_ATTRIBUTES_ON_PASTE = ["style", "class", "id", "name", "width", "height"];

window.QEditor = {
  actions: ['bold', 'italic', 'underline', 'strikethrough', 'insertunorderedlist', 'insertorderedlist', 'blockquote', 'pre'],
  action: function(el, a, p) {
    var editor;
    editor = $(".qeditor_preview", $(el).parent().parent().parent());
    editor.find(".qeditor_placeholder").remove();
    editor.focus();
    if (p === null) {
      p = false;
    }
    if (a === "blockquote" && !(QEditor.isWraped("blockquote") || QEditor.isWraped("pre"))) {
      QEditor.blockquote();
      return;
    }
    if (a === "pre" && !(QEditor.isWraped("blockquote") || QEditor.isWraped("pre"))) {
      QEditor.code();
      return;
    }
    if (a === "createLink") {
      p = prompt("Type URL:");
      if (p.trim().length === 0) {
        return false;
      }
    } else if (a === "insertimage") {
      p = prompt("Image URL:");
      if (p.trim().length === 0) {
        return false;
      }
    }
    if (QEditor.state(a)) {
      document.execCommand(a, false, null);
    } else {
      document.execCommand(a, false, p);
    }
    editor.change();
    QEditor.checkSectionState(editor);
    return false;
  },
  state: function(action) {
    return document.queryCommandState(action) === true;
  },
  prompt: function(title) {
    var val;
    val = prompt(title);
    if (val) {
      return val;
    } else {
      return false;
    }
  },
  toggleFullScreen: function(el) {
    var border;
    border = $(el).parent().parent().parent();
    if (border.data("qe-fullscreen") === "1") {
      QEditor.exitFullScreen();
    } else {
      QEditor.enterFullScreen(border);
    }
    return false;
  },
  enterFullScreen: function(border) {
    border.data("qe-fullscreen", "1").addClass("qeditor_fullscreen");
    border.find(".qeditor_preview").focus();
    return border.find(".qe-fullscreen i").attr("class", "fa fa-compress");
  },
  exitFullScreen: function() {
    return $(".qeditor_border").removeClass("qeditor_fullscreen").data("qe-fullscreen", "0").find(".qe-fullscreen i").attr("class", "fa fa-arrows-alt");
  },
  getCurrentContainerNode: function() {
    var containerNode, node;
    if (window.getSelection) {
      node = window.getSelection().anchorNode;
      containerNode = node && node.nodeType === 3 ? node.parentNode : node;
    }
    return containerNode;
  },
  checkSectionState: function(editor) {
    var a, link, _i, _len, _ref, _results;
    _ref = QEditor.actions;
    _results = [];
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      a = _ref[_i];
      link = editor.parent().find(".qeditor_toolbar button[data-action=" + a + "]");
      if (QEditor.state(a)) {
        _results.push(link.addClass("active"));
      } else {
        _results.push(link.removeClass("active"));
      }
    }
    return _results;
  },
  selectContents: function(contents) {
    var end, range, selection, start;
    selection = window.getSelection();
    range = selection.getRangeAt(0);
    start = contents.first()[0];
    end = contents.last()[0];
    range.setStart(start, 0);
    range.setEnd(end, end.childNodes.length || end.length);
    selection.removeAllRanges();
    return selection.addRange(range);
  },
  blockquote: function() {
    var $blockquote, $contents, end, range, rangeAncestor, selection, start;
    selection = window.getSelection();
    range = selection.getRangeAt(0);
    rangeAncestor = range.commonAncestorContainer;
    start = void 0;
    end = void 0;
    $blockquote = $(rangeAncestor).closest("blockquote");
    if ($blockquote.length) {
      $contents = $blockquote.contents();
      $blockquote.replaceWith($contents);
      return QEditor.selectContents($contents);
    } else {
      start = $(range.startContainer).closest("p, h1, h2, h3, h4, pre")[0];
      end = $(range.endContainer).closest("p, h1, h2, h3, h4, pre")[0];
      range.setStartBefore(start);
      range.setEndAfter(end);
      $blockquote = $("<blockquote>");
      $blockquote.html(range.extractContents()).find("blockquote").each(function() {
        return $(this).replaceWith($(this).html());
      });
      range.insertNode($blockquote[0]);
      selection.selectAllChildren($blockquote[0]);
      if ($blockquote.next().length === 0) {
        return $blockquote.after("<p><br></p>");
      }
    }
  },
  splitCode: function(code) {
    return code.html($.map(code.text().split("\n"), function(line) {
      if (line !== "") {
        return $("<p>").text(line);
      }
    }));
  },
  code: function() {
    var $code, $contents, $pre, end, hasBlock, isEmptyRange, isWholeBlock, range, rangeAncestor, selection, start;
    selection = window.getSelection();
    range = selection.getRangeAt(0);
    rangeAncestor = range.commonAncestorContainer;
    start = void 0;
    end = void 0;
    $contents = void 0;
    $code = $(rangeAncestor).closest("code");
    if ($code.length) {
      if ($code.closest("pre").length) {
        QEditor.splitCode($code);
        $contents = $code.contents();
        if ($contents.length === 0) {
          $contents = $("<p><br></p>");
        }
        $code.closest("pre").replaceWith($contents);
        return QEditor.selectContents($contents);
      } else {
        $contents = $code.contents();
        $code.replaceWith($code.contents());
        return QEditor.selectContents($contents);
      }
    } else {
      isEmptyRange = range.toString() === "";
      isWholeBlock = range.toString() === $(range.startContainer).closest("p, h1, h2, h3, h4").text();
      hasBlock = range.cloneContents().querySelector("p, h1, h2, h3, h4");
      if (isEmptyRange || isWholeBlock || hasBlock) {
        start = $(range.startContainer).closest("p, h1, h2, h3, h4")[0];
        end = $(range.endContainer).closest("p, h1, h2, h3, h4")[0];
        range.setStartBefore(start);
        range.setEndAfter(end);
        $code = $("<code>").html(range.extractContents());
        $pre = $("<pre>").html($code);
        range.insertNode($pre[0]);
        if ($pre.next().length === 0) {
          $pre.after("<p><br></p>");
        }
      } else {
        $code = $("<code>").html(range.extractContents());
        range.insertNode($code[0]);
      }
      return selection.selectAllChildren($code[0]);
    }
  },
  isWraped: function(selector) {
    if (QEditor.commonAncestorContainer()) {
      return $(QEditor.commonAncestorContainer()).closest(selector).length !== 0;
    } else {
      return false;
    }
  },
  commonAncestorContainer: function() {
    var selection;
    selection = document.getSelection();
    if (selection.rangeCount !== 0) {
      return selection.getRangeAt(0).commonAncestorContainer;
    }
  },
  version: function() {
    return "0.3.0";
  }
};

(function($) {
  return $.fn.qeditor = function(options) {
    return this.each(function() {
      var currentVal, editor, obj, placeholder, toolbar;
      obj = $(this);
      obj.addClass("qeditor");
      editor = $('<div class="qeditor_preview clearfix" contentEditable="true"></div>');
      placeholder = $('<div class="qeditor_placeholder"></div>');
      $(document).keyup(function(e) {
        if (e.keyCode === 27) {
          return QEditor.exitFullScreen();
        }
      });
      document.execCommand('defaultParagraphSeparator', false, 'p');
      currentVal = obj.val();
      editor.html(currentVal);
      editor.addClass(obj.attr("class"));
      placeholder.text(obj.attr("placeholder"));
      editor.attr("placeholder", obj.attr("placeholder") || "");
      if (currentVal === '') {
        editor.append(placeholder);
      }
      editor.focusin(function() {
        QEditor.checkSectionState(editor);
        return $(this).find(".qeditor_placeholder").remove();
      });
      editor.blur(function() {
        var t;
        t = $(this);
        QEditor.checkSectionState(editor);
        if (t.html().length === 0 || t.html() === "<br>" || t.html() === "<p></p>") {
          return $(this).html('<div class="qeditor_placeholder">' + $(this).attr("placeholder") + '</div>');
        }
      });
      editor.change(function() {
        var pobj, t;
        pobj = $(this);
        t = pobj.parent().find('.qeditor');
        return t.val(pobj.html());
      });
      editor.on("paste", function() {
        var txt;
        txt = $(this);
        return setTimeout(function() {
          var attrName, els, _i, _len;
          els = txt.find("*");
          for (_i = 0, _len = QEDITOR_DISABLE_ATTRIBUTES_ON_PASTE.length; _i < _len; _i++) {
            attrName = QEDITOR_DISABLE_ATTRIBUTES_ON_PASTE[_i];
            els.removeAttr(attrName);
          }
          els.find(":not(" + QEDITOR_ALLOW_TAGS_ON_PASTE + ")").contents().unwrap();
          txt.change();
          return true;
        }, 100);
      });
      editor.on('keyup', function(e) {
        QEditor.checkSectionState(editor);
        return $(this).change();
      });
      editor.keydown(function(e) {
        var $pre, html_str, isEnd, isLastLine, node, range, rangeAncestor, selection;
        html_str = $(this).html().trim();
        if (html_str.length === 0 || html_str === "<br>") {
          document.execCommand("formatBlock", false, "p");
        }
        if (e.keyCode === 13 && !(e.ctrlKey || e.shiftKey)) {
          if (document.queryCommandValue("formatBlock") === "pre") {
            event.preventDefault();
            selection = window.getSelection();
            range = selection.getRangeAt(0);
            rangeAncestor = range.commonAncestorContainer;
            $pre = $(rangeAncestor).closest("pre");
            range.deleteContents();
            isLastLine = $pre.find("code").contents().last()[0] === range.endContainer;
            isEnd = range.endContainer.length === range.endOffset;
            node = document.createTextNode("\n");
            range.insertNode(node);
            if (isLastLine && isEnd) {
              $pre.find("code").append(document.createTextNode("\n"));
            }
            range.setStartAfter(node);
            range.setEndAfter(node);
            selection.removeAllRanges();
            return selection.addRange(range);
          }
        }
      });
      obj.hide();
      obj.wrap('<div class="qeditor_border"></div>');
      obj.after(editor);
      toolbar = $(QEDITOR_TOOLBAR_HTML);
      toolbar.find('button[data-toggle=tooltip], button[data-toggle=popover]').tooltip({
        container: 'body'
      });
      toolbar.find('button[data-toggle=tooltip], button[data-toggle=popover]').mouseover(function() {
        $(this).tooltip('show');
        return false;
      });
      toolbar.find(".qe-heading .qe-menu a").click(function() {
        var link;
        link = $(this);
        editor.focus();
        QEditor.action(this, "formatBlock", link.data("name"));
        editor.change();
        link.parent().parent().parent().removeClass("open");
        return false;
      });
      toolbar.find("button[data-action]").click(function() {
        editor.focus();
        QEditor.action(this, $(this).attr("data-action"));
        editor.change();
        return QEditor.checkSectionState(editor);
      });
      return editor.before(toolbar);
    });
  };
})(jQuery);
