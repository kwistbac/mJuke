$(function () {
    $('ul.messages').fadeOut(2000);

    function updatePlayerQueue(data) {
        var queue = $('#queue');

        queue.data('ts', new Date().getTime()).empty();
        $.each(data.queue, function (index, song) {
            var item = $('<li>').addClass('list-group-item');
            $('<span>').html(song.title + ' - ' + song.artist)
                .addClass('title')
                .appendTo(item);
            $('<span>').attr('title', 'Number of votes')
                .addClass('badge')
                .html((song.queue < 0) ? '' : song.queue + ' ' + ((song.queue > 1) ? 'votes' : 'vote'))
                .appendTo(item);
            queue.append(item)
        });

        return true;
    }

    function updatePlayerSong(data) 
    {
        var player = $('#player').get(0);
        
        if(!data.current)
        {
            if(player.src)
            {
                player.src = '';
                $('#songTitle').empty();
                $('#songArtist').empty();
                $('#songAlbum').empty();
                $('#songImage').empty();
            }
        }
        else
        {
            player.src = data.current.url;
            player.play();

            $('#songTitle').html(data.current.title);
            $('#songArtist').html(data.current.artist);
            $('#songAlbum').html(data.current.album);
            if (data.current.image) {
                var img = $('<img>').attr('src', data.current.image);
                $('#songImage').empty().append(img);
            }
            else {
                var icon = $('<span>').addClass('glyphicon glyphicon-music');
                $('#songImage').empty().append(icon);
            }
        }
        return updatePlayerQueue(data);
    }

    function updatePlayer() {
        var player = $('#player').get(0);
        if (player) {
            var queue = $('#queue');
            var ts = new Date().getTime();

            if (!player.currentSrc) {
                $.getJSON("player/current", updatePlayerSong);
            }
            else if (player.currentTime >= player.duration - 1 || player.ended) {
                $.getJSON("player/next", updatePlayerSong);
            }
            else if (!queue.data('ts') || queue.data('ts') + 5000 < ts) {
                $.getJSON("player/queue", updatePlayerQueue);
            }
        }
    }

    updatePlayer();
    setInterval(updatePlayer, 1000);

    $(document).on('submit', ".modal form", function (e) {
            e.preventDefault();

            var form = $(this);
            var modal = form.closest('.modal');

            form.append('<input type="hidden" name="ok" value="1">');
            var values = (form.attr('method') && form.attr('method').toUpperCase() == 'POST' ? form.serializeArray() : form.serialize());

            modal.load(form.attr('action'), values, function (data, textStatus, xhr) {
                if (!data)
                    modal.modal('hide');
                else
                    $(this).trigger('loaded.bs.modal');
            });
        })
        .on('click', "#library", function (e) {
            e.preventDefault();

            var modal = $('<div>').attr('id', 'libraryModal')
                .addClass('modal')
                .addClass('fade');

            modal.on('hidden.bs.modal', function () {
                $(this).remove();
            })
                .modal()
                .load($(this).attr('href'), function () {
                    $(this).trigger('loaded.bs.modal');
                });

        })
        .on('click', "#libraryAdd", function (e) {
            e.preventDefault();

            var modal = $('<div>').attr('id', 'libraryAddModal')
                .addClass('modal')
                .addClass('fade');

            modal.on('hidden.bs.modal', function () {
                $('#libraryModal').load('/establishment/library/', function () {
                    $(this).trigger('loaded.bs.modal');
                });
                $.post('/establishment/library/upload/clean');
                $(this).remove();
            })
                .on('loaded.bs.modal', function () {
                    var el = modal.find('#uploader');
                    if (el.length) {
                        var uploader = new qq.FineUploader(
                            {
                                element: el.get(0),
                                multiple: true,
                                validation: { allowedExtensions: ['mp3'] },
                                request: { endpoint: '/establishment/library/upload' },
                                retry: { enableAuto: true },
                                chunking: { enabled: true },
                                deleteFile: { endpoint: '/establishment/library/upload', enabled: true, forceConfirm: true },
                                callbacks: { onError: function (id, name, reason) {
                                    alert(reason);
                                } }
                            });
                    }
                })
                .on('click', '#libraryAddSave', function () {
                    modal.find('form:first').submit();
                })
                .modal()
                .load($(this).attr('href'), function () {
                    $(this).trigger('loaded.bs.modal');
                });

        })
        .on('click', "#libraryAddSpotify", function (e) {
            e.preventDefault();
            
            var modal = $('<div>').attr('id', 'libraryAddSpotifyModal')
            .addClass('modal')
            .addClass('fade');
            
            modal.on('hidden.bs.modal', function () {
                $('#libraryModal').load('/establishment/library/', function () {
                    $(this).trigger('loaded.bs.modal');
                });
                $(this).remove();
            })
            .on('click', '#libraryAddSpotifySave', function () {
                modal.find('form:first').submit();
            })
            .modal()
            .load($(this).attr('href'), function () {
                $(this).trigger('loaded.bs.modal');
            });
            
        })        
        .on('click', "#libraryEdit", function (e) {
            e.preventDefault();

            var modal = $('<div>').attr('id', 'libraryEditModal')
                .addClass('modal')
                .addClass('fade');

            modal.on('hidden.bs.modal', function () {
                $('#libraryModal').load('/establishment/library/', function () {
                    $(this).trigger('loaded.bs.modal');
                });
                $(this).remove();
            })
                .on('click', '#libraryEditSave', function () {
                    modal.find('form:first').submit();
                })
                .modal()
                .load($(this).attr('href'), function () {
                    $(this).trigger('loaded.bs.modal');
                });

        })
        .on('click', "#libraryRemove", function (e) {
            e.preventDefault();

            var modal = $('<div>').attr('id', 'libraryRemoveModal')
                .addClass('modal')
                .addClass('fade');

            modal.on('hidden.bs.modal', function () {
                $('#libraryModal').load('/establishment/library/', function () {
                    $(this).trigger('loaded.bs.modal');
                });
                $(this).remove();
            })
                .on('click', '#libraryRemoveConfirm', function () {
                    modal.find('form:first').submit();
                })
                .modal()
                .load($(this).attr('href'), function () {
                    $(this).trigger('loaded.bs.modal');
                });

        })
        .on('click', "#manage_qr", function (e) {
            e.preventDefault();

            var modal = $('<div>').attr('id', 'manageQR')
                .addClass('modal')
                .addClass('fade');

            modal.on('hidden.bs.modal', function () {
                $('#libraryModal').load('/establishment/qr/', function () {
                    $(this).trigger('loaded.bs.modal');
                });
                $(this).remove();
            })
                .on('click', '#qrSave', function () {
                    modal.find('form:first').submit();
                })
                .modal()
                .load($(this).attr('href'), function () {
                    $(this).trigger('loaded.bs.modal');
                    //$(this).find('#id_startedOn').datetimepicker();
                    //$(this).find('#id_expiredOn').datetimepicker();
                });
        })
        .on('click', "#changeUsername", function (e) {

            e.preventDefault();

            var modal = $('<div>').attr('id', 'changeUsernameModal')
                .addClass('modal')
                .addClass('fade');

            modal.on('hidden.bs.modal', function () {
                $('#libraryModal').load('/accounts/change_username/', function () {
                    $(this).trigger('loaded.bs.modal');
                });
                $(this).remove();
            })
                .on('click', '#usernameSave', function () {
                    modal.find('form:first').submit();
                })
                .modal()
                .load($(this).attr('href'), function () {
                    $(this).trigger('loaded.bs.modal');
                });
        })
        .on('click', "#edit_account_info", function (e) {
            e.preventDefault();

            var modal = $('<div>').attr('id', 'editAccountInfoModal')
                .addClass('modal')
                .addClass('fade');

            modal.on('hidden.bs.modal', function () {
                $('#libraryModal').load('/accounts/edit', function () {
                    $(this).trigger('loaded.bs.modal');
                });
                $(this).remove();
            })
                .on('click', '#editAccountSave', function () {
                    modal.find('form:first').submit();
                })
                .modal()
                .load($(this).attr('href'), function () {
                    $(this).trigger('loaded.bs.modal');
                });
        })
        .on('click', "#edit_other", function (e) {
            e.preventDefault();

            var modal = $('<div>').attr('id', 'editOtherModal')
                .addClass('modal')
                .addClass('fade');

            modal.on('hidden.bs.modal', function () {
                $('#libraryModal').load('/accounts/edit_other', function () {
                    $(this).trigger('loaded.bs.modal');
                });
                $(this).remove();
            })
                .on('click', '#otherInfoSave', function () {
                    modal.find('form:first').submit();
                })
                .modal()
                .load($(this).attr('href'), function () {
                    $(this).trigger('loaded.bs.modal');
                });
        })
        .on('click', "#change_password", function (e) {
            e.preventDefault();

            var modal = $('<div>').attr('id', 'changePasswordModal')
                .addClass('modal')
                .addClass('fade');

            modal.on('hidden.bs.modal', function () {
                $('#libraryModal').load('/accounts/change_password', function () {
                    $(this).trigger('loaded.bs.modal');
                });
                $(this).remove();
            })
                .on('click', '#passwordChanageSave', function () {
                    modal.find('form:first').submit();
                })
                .modal()
                .load($(this).attr('href'), function () {
                    $(this).trigger('loaded.bs.modal');
                });
        });
});