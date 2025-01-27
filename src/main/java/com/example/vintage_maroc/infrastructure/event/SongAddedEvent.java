package com.example.vintage_maroc.infrastructure.event;

import lombok.Getter;

@Getter
public class SongAddedEvent extends DomainEvent {
    private final String songId;
    private final String title;
    private final String albumId;

    public SongAddedEvent(Object source, String songId, String title, String albumId) {
        super(source);
        this.songId = songId;
        this.title = title;
        this.albumId = albumId;
    }
}

