(function($) {
  // Array.indexOf polyfill
  if (!Array.prototype.indexOf) {
    Array.prototype.indexOf = function(searchElement, fromIndex) {
      if (this == null) {
        throw new TypeError('"this" is null or not defined');
      }
      var i = 0,
        length = this.length >>> 0;
      if (length === 0) {
        return -1;
      }
      var n = 0 | fromIndex;
      if (n >= length) {
        return -1;
      }
      for (var k = Math.max(n >= 0 ? n : length - Math.abs(n), 0); k < length; k++) {
        if (k in this && this[k] === searchElement) {
          return k;
        }
      }
      return -1;
    };
  }

  $.fn.mauGallery = function(options) {
    var settings = $.extend({}, $.fn.mauGallery.defaults, options);
    var tags = [];

    return this.each(function() {
      $.fn.mauGallery.methods.createRowWrapper($(this));

      if (settings.lightBox) {
        $.fn.mauGallery.methods.createLightBox($(this), settings.lightboxId, settings.navigation);
      }

      $.fn.mauGallery.listeners(settings);

      $(this).children(".gallery-item").each(function(index) {
        $.fn.mauGallery.methods.responsiveImageItem($(this));
        $.fn.mauGallery.methods.moveItemInRowWrapper($(this));
        $.fn.mauGallery.methods.wrapItemInColumn($(this), settings.columns);
        var tag = $(this).data("gallery-tag");

        if (settings.showTags && tag !== undefined && tags.indexOf(tag) === -1) {
          tags.push(tag);
        }
      });

      if (settings.showTags) {
        $.fn.mauGallery.methods.showItemTags($(this), settings.tagsPosition, tags);
      }

      $(this).fadeIn(500);
    });
  };

  $.fn.mauGallery.defaults = {
    columns: 3,
    lightBox: true,
    lightboxId: null,
    showTags: true,
    tagsPosition: "bottom",
    navigation: true
  };

  $.fn.mauGallery.listeners = function(settings) {
    $(".gallery-item").on("click", function() {
      if (settings.lightBox && $(this).prop("tagName") === "IMG") {
        $.fn.mauGallery.methods.openLightBox($(this), settings.lightboxId);
      }
    });

    $(".gallery").on("click", ".nav-link", $.fn.mauGallery.methods.filterByTag);

    $(".gallery").on("click", ".mg-prev", function() {
      $.fn.mauGallery.methods.prevImage(settings.lightboxId);
    });

    $(".gallery").on("click", ".mg-next", function() {
      $.fn.mauGallery.methods.nextImage(settings.lightboxId);
    });
  };

  $.fn.mauGallery.methods = {
    createRowWrapper: function(element) {
      if (!element.children().first().hasClass("row")) {
        element.append('<div class="gallery-items-row row"></div>');
      }
    },

    wrapItemInColumn: function(element, columns) {
      if (columns.constructor === Number) {
        element.wrap('<div class="item-column mb-4 col-' + Math.ceil(12 / columns) + '"></div>');
      } else if (columns.constructor === Object) {
        var columnClasses = "";
        if (columns.xs) {
          columnClasses += ' col-' + Math.ceil(12 / columns.xs);
        }
        if (columns.sm) {
          columnClasses += ' col-sm-' + Math.ceil(12 / columns.sm);
        }
        if (columns.md) {
          columnClasses += ' col-md-' + Math.ceil(12 / columns.md);
        }
        if (columns.lg) {
          columnClasses += ' col-lg-' + Math.ceil(12 / columns.lg);
        }
        if (columns.xl) {
          columnClasses += ' col-xl-' + Math.ceil(12 / columns.xl);
        }
        element.wrap('<div class="item-column mb-4' + columnClasses + '"></div>');
      } else {
        console.error('Columns should be defined as numbers or objects. ' + typeof columns + ' is not supported.');
      }
    },

    moveItemInRowWrapper: function(element) {
      element.appendTo(".gallery-items-row");
    },

    responsiveImageItem: function(element) {
      if (element.prop("tagName") === "IMG") {
        element.addClass("img-fluid");
      }
    },

    openLightBox: function(element, lightboxId) {
      $('#' + lightboxId).find(".lightboxImage").attr("src", element.attr("src"));
      $('#' + lightboxId).modal("toggle");
    },

    prevImage: function(lightboxId) {
      var currentImage = null;

      $("img.gallery-item").each(function() {
        if ($(this).attr("src") === $(".lightboxImage").attr("src")) {
          currentImage = $(this);
        }
      });

      var activeTag = $(".tags-bar span.active-tag").data("images-toggle");
      var imageList = [];

      if (activeTag === "all") {
        $(".item-column").each(function() {
          if ($(this).children("img").length) {
            imageList.push($(this).children("img"));
          }
        });
      } else {
        $(".item-column").each(function() {
          if ($(this).children("img").data("gallery-tag") === activeTag) {
            imageList.push($(this).children("img"));
          }
        });
      }

      var currentIndex = 0;
      var previousImage = null;

      $(imageList).each(function(index) {
        if ($(currentImage).attr("src") === $(this).attr("src")) {
          currentIndex = index;
        }
      });

      previousImage = imageList[currentIndex - 1] || imageList[imageList.length - 1];

      $(".lightboxImage").attr("src", $(previousImage).attr("src"));
    },

    nextImage: function(lightboxId) {
      var currentImage = null;

      $("img.gallery-item").each(function() {
        if ($(this).attr("src") === $(".lightboxImage").attr("src")) {
          currentImage = $(this);
        }
      });

      var activeTag = $(".tags-bar span.active-tag").data("images-toggle");
      var imageList = [];

      if (activeTag === "all") {
        $(".item-column").each(function() {
          if ($(this).children("img").length) {
            imageList.push($(this).children("img"));
          }
        });
      } else {
        $(".item-column").each(function() {
          if ($(this).children("img").data("gallery-tag") === activeTag) {
            imageList.push($(this).children("img"));
          }
        });
      }

      var currentIndex = 0;
      var nextImage = null;

      $(imageList).each(function(index) {
        if ($(currentImage).attr("src") === $(this).attr("src")) {
          currentIndex = index;
        }
      });

      nextImage = imageList[currentIndex + 1] || imageList[0];

      $(".lightboxImage").attr("src", $(nextImage).attr("src"));
    },

    createLightBox: function(element, lightboxId, navigation) {
      element.append(
        '<div class="modal fade" id="' +
          (lightboxId || "galleryLightbox") +
          '" tabindex="-1" role="dialog" aria-hidden="true">' +
          '<div class="modal-dialog" role="document">' +
          '<div class="modal-content">' +
          '<div class="modal-body">' +
          (navigation
            ? '<div class="mg-prev" style="cursor:pointer;position:absolute;top:50%;left:-15px;background:white;"><</div>'
            : '<span style="display:none;"></span>') +
          '<img class="lightboxImage img-fluid" alt="Contenu de l\'image affichée dans la modale au clic"/>' +
          (navigation
            ? '<div class="mg-next" style="cursor:pointer;position:absolute;top:50%;right:-15px;background:white;">></div>'
            : '<span style="display:none;"></span>') +
          "</div>" +
          "</div>" +
          "</div>" +
          "</div>"
      );
    },

    showItemTags: function(element, position, tags) {
      var tagList = '<li class="nav-item"><span class="nav-link active active-tag" data-images-toggle="all">Tous</span></li>';

      $.each(tags, function(index, tag) {
        tagList +=
          '<li class="nav-item">' +
          '<span class="nav-link" data-images-toggle="' +
          tag +
          '">' +
          tag +
          "</span>" +
          "</li>";
      });

      var tagsBar = '<ul class="my-4 tags-bar nav nav-pills">' + tagList + "</ul>";

      if (position === "bottom") {
        element.append(tagsBar);
      } else if (position === "top") {
        element.prepend(tagsBar);
      } else {
        console.error("Unknown tags position: " + position);
      }
    },

    filterByTag: function() {
      if (!$(this).hasClass("active") || $(this).hasClass("active-tag")) {
        $(".nav-link").removeClass("active");
        $(this).addClass("active");

        var imagesToggle = $(this).data("images-toggle");

        $(".gallery-item").each(function() {
          $(this)
            .parents(".item-column")
            .hide();

          if (imagesToggle === "all") {
            $(this)
              .parents(".item-column")
              .show(300);
          } else if ($(this).data("gallery-tag") === imagesToggle) {
            $(this)
              .parents(".item-column")
              .show(300);
          }
        });
      }
    }
  };
})(jQuery);
