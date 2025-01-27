package com.example.vintage_maroc.infrastructure.listener;

import com.example.vintage_maroc.infrastructure.event.AlbumCreatedEvent;
import com.example.vintage_maroc.infrastructure.event.SongAddedEvent;
import com.example.vintage_maroc.infrastructure.facade.UserNotificationFacade;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.context.event.EventListener;
import org.springframework.stereotype.Component;

@Slf4j
@Component
@RequiredArgsConstructor
public class MusicEventListener {

    private final UserNotificationFacade userNotificationFacade;

    @EventListener
    public void handleAlbumCreatedEvent(AlbumCreatedEvent event) {
        log.info("New album created: {}", event.getTitle());
        userNotificationFacade.notifyAdminsOfNewAlbum(event.getAlbumId(), event.getTitle(), event.getArtist());
    }

    @EventListener
    public void handleSongAddedEvent(SongAddedEvent event) {
        log.info("New song added: {}", event.getTitle());
        userNotificationFacade.notifyUsersOfNewSong(event.getSongId(), event.getTitle(), event.getAlbumId());
    }
}

