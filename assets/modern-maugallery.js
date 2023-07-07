!function(a){
    a.fn.mauGallery = function(t) {
      var t = a.extend(a.fn.mauGallery.defaults,t),
          e = [];
      
      return this.each(function(){
        a.fn.mauGallery.methods.createRowWrapper(a(this));
        
        if (t.lightBox) {
          a.fn.mauGallery.methods.createLightBox(a(this), t.lightboxId, t.navigation);
        }
        
        a.fn.mauGallery.listeners(t);
        
        a(this).children(".gallery-item").each(function(l){
          a.fn.mauGallery.methods.responsiveImageItem(a(this));
          a.fn.mauGallery.methods.moveItemInRowWrapper(a(this));
          a.fn.mauGallery.methods.wrapItemInColumn(a(this), t.columns);
          
          var i = a(this).data("gallery-tag");
          if (t.showTags && i !== undefined && e.indexOf(i) === -1) {
            e.push(i);
          }
        });
        
        if (t.showTags) {
          a.fn.mauGallery.methods.showItemTags(a(this), t.tagsPosition, e);
        }
        
        a(this).fadeIn(500);
      });
    };
    
    a.fn.mauGallery.defaults = {
      columns: 3,
      lightBox: true,
      lightboxId: null,
      showTags: true,
      tagsPosition: "bottom",
      navigation: true
    };
    
    a.fn.mauGallery.listeners = function(t) {
      a(".gallery-item").on("click", function() {
        if (t.lightBox && a(this).prop("tagName") === "IMG") {
          a.fn.mauGallery.methods.openLightBox(a(this), t.lightboxId);
        }
      });
      
      a(".gallery").on("click", ".nav-link", a.fn.mauGallery.methods.filterByTag);
      
      a(".gallery").on("click", ".mg-prev", function() {
        a.fn.mauGallery.methods.prevImage(t.lightboxId);
      });
      
      a(".gallery").on("click", ".mg-next", function() {
        a.fn.mauGallery.methods.nextImage(t.lightboxId);
      });
    };
    
    a.fn.mauGallery.methods = {
      createRowWrapper: function(a) {
        if (!a.children().first().hasClass("row")) {
          a.append('<div class="gallery-items-row row"></div>');
        }
      },
      
      wrapItemInColumn: function(a, t) {
        if (t.constructor === Number) {
          a.wrap('<div class="item-column mb-4 col-' + Math.ceil(12/t) + '"></div>');
        } else if (t.constructor === Object) {
          var e = "";
          if (t.xs) {
            e += ' col-' + Math.ceil(12/t.xs);
          }
          if (t.sm) {
            e += ' col-sm-' + Math.ceil(12/t.sm);
          }
          if (t.md) {
            e += ' col-md-' + Math.ceil(12/t.md);
          }
          if (t.lg) {
            e += ' col-lg-' + Math.ceil(12/t.lg);
          }
          if (t.xl) {
            e += ' col-xl-' + Math.ceil(12/t.xl);
          }
          a.wrap('<div class="item-column mb-4' + e + '"></div>');
        } else {
          console.error('Columns should be defined as numbers or objects. ' + typeof t + ' is not supported.');
        }
      },
      
      moveItemInRowWrapper: function(a) {
        a.appendTo(".gallery-items-row");
      },
      
      responsiveImageItem: function(a) {
        if (a.prop("tagName") === "IMG") {
          a.addClass("img-fluid");
        }
      },
      
      openLightBox: function(t, e) {
        a('#' + e).find(".lightboxImage").attr("src", t.attr("src"));
        a('#' + e).modal("toggle");
      },
      
      prevImage: function(lightboxId) {
        var currentImage = null;
        
        a("img.gallery-item").each(function() {
          if (a(this).attr("src") === a(".lightboxImage").attr("src")) {
            currentImage = a(this);
          }
        });
        
        var activeTag = a(".tags-bar span.active-tag").data("images-toggle");
        var imageList = [];
        
        if (activeTag === "all") {
          a(".item-column").each(function() {
            if (a(this).children("img").length) {
              imageList.push(a(this).children("img"));
            }
          });
        } else {
          a(".item-column").each(function() {
            if (a(this).children("img").data("gallery-tag") === activeTag) {
              imageList.push(a(this).children("img"));
            }
          });
        }
        
        var currentIndex = 0;
        var previousImage = null;
        
        a(imageList).each(function(index) {
          if (a(currentImage).attr("src") === a(this).attr("src")) {
            currentIndex = index;
          }
        });
        
        previousImage = imageList[currentIndex - 1] || imageList[imageList.length - 1];
        
        a(".lightboxImage").attr("src", a(previousImage).attr("src"));
      },
      
      nextImage: function(lightboxId) {
        var currentImage = null;
        
        a("img.gallery-item").each(function() {
          if (a(this).attr("src") === a(".lightboxImage").attr("src")) {
            currentImage = a(this);
          }
        });
        
        var activeTag = a(".tags-bar span.active-tag").data("images-toggle");
        var imageList = [];
        
        if (activeTag === "all") {
          a(".item-column").each(function() {
            if (a(this).children("img").length) {
              imageList.push(a(this).children("img"));
            }
          });
        } else {
          a(".item-column").each(function() {
            if (a(this).children("img").data("gallery-tag") === activeTag) {
              imageList.push(a(this).children("img"));
            }
          });
        }
        
        var currentIndex = 0;
        var nextImage = null;
        
        a(imageList).each(function(index) {
          if (a(currentImage).attr("src") === a(this).attr("src")) {
            currentIndex = index;
          }
        });
        
        nextImage = imageList[currentIndex + 1] || imageList[0];
        
        a(".lightboxImage").attr("src", a(nextImage).attr("src"));
      },
      
      createLightBox(a,t,e){a.append(`<div class="modal fade" id="${t||"galleryLightbox"}" tabindex="-1" role="dialog" aria-hidden="true">
                <div class="modal-dialog" role="document">
                    <div class="modal-content">
                        <div class="modal-body">
                            ${e?'<div class="mg-prev" style="cursor:pointer;position:absolute;top:50%;left:-15px;background:white;"><</div>':'<span style="display:none;" />'}
                            <img class="lightboxImage img-fluid" alt="Contenu de l'image affich\xe9e dans la modale au clique"/>
                            ${e?'<div class="mg-next" style="cursor:pointer;position:absolute;top:50%;right:-15px;background:white;}">></div>':'<span style="display:none;" />'}
                        </div>
                    </div>
                </div>
            </div>`)},showItemTags(t,e,l){var i='<li class="nav-item"><span class="nav-link active active-tag"  data-images-toggle="all">Tous</span></li>';a.each(l,function(a,t){i+=`<li class="nav-item">
          <span class="nav-link" data-images-toggle="${t}">${t}</span>
        </li>`});var s=`<ul class="my-4 tags-bar nav nav-pills">${i}</ul>`;"bottom"===e?t.append(s):"top"===e?t.prepend(s):console.error(`Unknown tags position: ${e}`)},filterByTag(){if(!a(this).hasClass("active")||a(this).hasClass("active-tag")){a(".nav-link").removeClass("active"),a(this).addClass("active");var t=a(this).data("images-toggle");a(".gallery-item").each(function(){a(this).parents(".item-column").hide(),"all"===t?a(this).parents(".item-column").show(300):a(this).data("gallery-tag")===t&&a(this).parents(".item-column").show(300)})}}}}(jQuery); 