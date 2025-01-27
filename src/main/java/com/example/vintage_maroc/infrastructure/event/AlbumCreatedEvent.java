package com.example.vintage_maroc.infrastructure.event;

import lombok.Getter;

@Getter
public class AlbumCreatedEvent extends DomainEvent {
    private final String albumId;
    private final String title;
    private final String artist;

    public AlbumCreatedEvent(Object source, String albumId, String title, String artist) {
        super(source);
        this.albumId = albumId;
        this.title = title;
        this.artist = artist;
    }
}

