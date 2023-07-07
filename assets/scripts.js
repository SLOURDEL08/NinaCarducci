(function($) {
    // Polyfill for Array.indexOf
    if (!Array.prototype.indexOf) {
      Array.prototype.indexOf = function(searchElement, fromIndex) {
        if (this === undefined || this === null) {
          throw new TypeError("Cannot convert this value to object");
        }
        var length = this.length >>> 0; // ensure unsigned
        fromIndex = +fromIndex || 0;
        if (Math.abs(fromIndex) === Infinity) {
          fromIndex = 0;
        }
        if (fromIndex < 0) {
          fromIndex += length;
          if (fromIndex < 0) {
            fromIndex = 0;
          }
        }
        for (; fromIndex < length; fromIndex++) {
          if (this[fromIndex] === searchElement) {
            return fromIndex;
          }
        }
        return -1;
      };
    }
  
    $(function() {
      $(".gallery").mauGallery({
        columns: {
          xs: 1,
          sm: 2,
          md: 3,
          lg: 3,
          xl: 3
        },
        lightBox: true,
        lightboxId: "myAwesomeLightbox",
        showTags: true,
        tagsPosition: "top"
      });
    });
  
    $.fn.mauGallery = function(options) {
      var settings = $.extend({}, $.fn.mauGallery.defaults, options);
      var tags = [];
  
      return this.each(function() {
        $.fn.mauGallery.methods.createRowWrapper($(this));
  
        if (settings.lightBox) {
          $.fn.mauGallery.methods.createLightBox(
            $(this),
            settings.lightboxId,
            settings.navigation
          );
        }
  
        $.fn.mauGallery.listeners(settings);
  
        $(this)
          .children(".gallery-item")
          .each(function(index) {
            $.fn.mauGallery.methods.responsiveImageItem($(this));
            $.fn.mauGallery.methods.moveItemInRowWrapper($(this));
            $.fn.mauGallery.methods.wrapItemInColumn(
              $(this),
              settings.columns
            );
  
            var tag = $(this).data("gallery-tag");
            if (settings.showTags && tag !== undefined && tags.indexOf(tag) === -1) {
              tags.push(tag);
            }
          });
  
        if (settings.showTags) {
          $.fn.mauGallery.methods.showItemTags(
            $(this),
            settings.tagsPosition,
            tags
          );
        }
  
        $(this).fadeIn(500);
      });
    };
  
    $.fn.mauGallery.defaults = {
      columns: {
        xs: 1,
        sm: 2,
        md: 3,
        lg: 3,
        xl: 3
      },
      lightBox: true,
      lightboxId: null,
      showTags: true,
      tagsPosition: "bottom",
      navigation: true
    };
  
    $.fn.mauGallery.listeners = function(settings) {
      $(".gallery-item").on("click", function() {
        if (settings.lightBox && $(this).prop("tagName") === "IMG") {
          $.fn.mauGallery.methods.openLightBox(
            $(this),
            settings.lightboxId
          );
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
        createRowWrapper: function($element) {
            if (!$element.children().first().hasClass("row")) {
              $element.append('<div class="gallery-items-row row"></div>');
            }
          },
          wrapItemInColumn: function($element, columns) {
            if (columns.constructor === Number) {
              $element.wrap('<div class="item-column mb-4 col-' + Math.ceil(12 / columns) + '"></div>');
            } else if (columns.constructor === Object) {
              var columnClasses = "";
              columns.xs && (columnClasses += " col-" + Math.ceil(12 / columns.xs));
              columns.sm && (columnClasses += " col-sm-" + Math.ceil(12 / columns.sm));
              columns.md && (columnClasses += " col-md-" + Math.ceil(12 / columns.md));
              columns.lg && (columnClasses += " col-lg-" + Math.ceil(12 / columns.lg));
              columns.xl && (columnClasses += " col-xl-" + Math.ceil(12 / columns.xl));
              $element.wrap('<div class="item-column mb-4' + columnClasses + '"></div>');
            } else {
              console.error("Columns should be defined as numbers or objects. " + typeof columns + " is not supported.");
            }
          },
          moveItemInRowWrapper: function($element) {
            $element.appendTo(".gallery-items-row");
          },
          responsiveImageItem: function($element) {
            if ($element.prop("tagName") === "IMG") {
              $element.addClass("img-fluid");
            }
          },
          openLightBox: function($target, lightboxId) {
            $("#" + lightboxId)
              .find(".lightboxImage")
              .attr("src", $target.attr("src"));
            $("#" + lightboxId).modal("toggle");
          },
          prevImage: function(lightboxId) {
            var currentImage = null;
            $("img.gallery-item").each(function() {
              if ($(this).attr("src") === $(".lightboxImage").attr("src")) {
                currentImage = $(this);
              }
            });
      
            var activeTag = $(".tags-bar span.active-tag").data("images-toggle");
            var images = [];
      
            if (activeTag === "all") {
              $(".item-column").each(function() {
                if ($(this).children("img").length) {
                  images.push($(this).children("img"));
                }
              });
            } else {
              $(".item-column").each(function() {
                if ($(this).children("img").data("gallery-tag") === activeTag) {
                  images.push($(this).children("img"));
                }
              });
            }
      
            var currentIndex = 0;
            var previousImage = null;
      
            $.each(images, function(index) {
              if (currentImage.attr("src") === $(this).attr("src")) {
                currentIndex = index;
              }
            });
      
            previousImage = images[currentIndex - 1] || images[images.length - 1];
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
            var images = [];
      
            if (activeTag === "all") {
              $(".item-column").each(function() {
                if ($(this).children("img").length) {
                  images.push($(this).children("img"));
                }
              });
            } else {
              $(".item-column").each(function() {
                if ($(this).children("img").data("gallery-tag") === activeTag) {
                  images.push($(this).children("img"));
                }
              });
            }
      
            var currentIndex = 0;
            var nextImage = null;
      
            $.each(images, function(index) {
              if (currentImage.attr("src") === $(this).attr("src")) {
                currentIndex = index;
              }
            });
      
            nextImage = images[currentIndex + 1] || images[0];
            $(".lightboxImage").attr("src", $(nextImage).attr("src"));
          },
          createLightBox: function($element, lightboxId, navigation) {
            var lightboxHtml = '<div class="modal fade" id="' + (lightboxId || "galleryLightbox") + '" tabindex="-1" role="dialog" aria-hidden="true">' +
              '<div class="modal-dialog" role="document">' +
              '<div class="modal-content">' +
              '<div class="modal-body">' +
              (navigation ? '<div class="mg-prev" style="cursor:pointer;position:absolute;top:50%;left:-15px;background:white;"><</div>' : '<span style="display:none;"></span>') +
              '<img class="lightboxImage img-fluid" alt="Contenu de l\'image affichée dans la modale au clique"/>' +
              (navigation ? '<div class="mg-next" style="cursor:pointer;position:absolute;top:50%;right:-15px;background:white;}">></div>' : '<span style="display:none;"></span>') +
              '</div>' +
              '</div>' +
              '</div>' +
              '</div>';
      
            $element.append(lightboxHtml);
          },
          showItemTags: function($element, tagsPosition, tags) {
            var tagsHtml = '<li class="nav-item"><span class="nav-link active active-tag" data-images-toggle="all">Tous</span></li>';
            $.each(tags, function(index, tag) {
              tagsHtml += '<li class="nav-item">' +
                '<span class="nav-link" data-images-toggle="' + tag + '">' + tag + '</span>' +
                '</li>';
            });
      
            var tagsBarHtml = '<ul class="my-4 tags-bar nav nav-pills">' + tagsHtml + '</ul>';
      
            if (tagsPosition === "bottom") {
              $element.append(tagsBarHtml);
            } else if (tagsPosition === "top") {
              $element.prepend(tagsBarHtml);
            } else {
              console.error("Unknown tags position: " + tagsPosition);
            }
          },
          filterByTag: function() {
            if (!$(this).hasClass("active") || $(this).hasClass("active-tag")) {
              $(".nav-link").removeClass("active");
              $(this).addClass("active");
      
              var toggle = $(this).data("images-toggle");
      
              $(".gallery-item").each(function() {
                $(this)
                  .parents(".item-column")
                  .hide();
      
                if (toggle === "all") {
                  $(this)
                    .parents(".item-column")
                    .show(300);
                } else if ($(this).data("gallery-tag") === toggle) {
                  $(this)
                    .parents(".item-column")
                    .show(300);
                }
              });
            }
          }
        };
      })(jQuery);
      