// @license magnet:?xt=urn:btih:0b31508aeb0634b347b8270c7bee4d411b5d4109&dn=agpl-3.0.txt AGPL-v3-or-Later
//= require js_image_paths

function createUploader(){

   var aspectIds = gon.preloads.aspect_ids;

   var uploader = new qq.FileUploaderBasic({
       element: document.getElementById('file-upload-publisher'),
       params: {'photo' : {'pending' : 'true', 'aspect_ids' : aspectIds},},
       allowedExtensions: ['jpg', 'jpeg', 'png', 'gif', 'tiff'],
       action: "/photos",
       debug: true,
       button: document.getElementById('file-upload-publisher'),
       sizeLimit: 4194304,

       onProgress: function(id, fileName, loaded, total){
        var progress = Math.round(loaded / total * 100 );
         $('#fileInfo-publisher').text(fileName + ' ' + progress + '%');
       },

       messages: {
          typeError: Diaspora.I18n.t("photo_uploader.invalid_ext"),
          sizeError: Diaspora.I18n.t("photo_uploader.new_photo.size_error"),
          emptyError: Diaspora.I18n.t("photo_uploader.new_photo.empty")
       },

       onSubmit: function(id, fileName){
        $('#file-upload-publisher').addClass("loading");
        $('#publisher_textarea_wrapper').addClass("with_attachments");
        $('#photodropzone').append(
          "<li class='publisher_photo loading' style='position:relative;'>" +
            "<img alt='Ajax-loader2' src='"+ImagePaths.get('ajax-loader2.gif')+"' />" +
          "</li>"
          );
       },

       onComplete: function(id, fileName, responseJSON) {
        $('#fileInfo-publisher').text(Diaspora.I18n.t("photo_uploader.completed", {'file': fileName}));
        var id = responseJSON.data.photo.id,
            url = responseJSON.data.photo.unprocessed_image.url,
            currentPlaceholder = $('li.loading').first();

        $('#publisher_textarea_wrapper').addClass("with_attachments");
        $('#new_status_message').append("<input type='hidden' value='" + id + "' name='photos[]' />");

        // replace image placeholders
        var img = currentPlaceholder.find('img');
        img.attr('src', url);
        img.attr('data-id', id);
        currentPlaceholder.removeClass('loading');
        currentPlaceholder.append("<div class='x'>X</div>" +
            "<div class='circle'></div>");
        ////

        var publisher = $('#publisher'),
            textarea = publisher.find('textarea');

        publisher.find("input[type='submit']").removeAttr('disabled');

        $('.x').bind('click', function(){
          var photo = $(this).closest('.publisher_photo');
          photo.addClass("dim");
          $.ajax({url: "/photos/" + photo.children('img').attr('data-id'),
                  dataType: 'json',
                  type: 'DELETE',
                  success: function() {
                            photo.fadeOut(400, function(){
                              photo.remove();
                              if ( $('.publisher_photo').length == 0){
                                $('#publisher_textarea_wrapper').removeClass("with_attachments");
                              }
                            });
                          }
                  });
        });
       },

       onAllComplete: function(completed_files){
       }

   });
}
createUploader();
// @license-end
