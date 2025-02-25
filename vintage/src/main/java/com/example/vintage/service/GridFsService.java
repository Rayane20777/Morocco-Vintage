package com.example.vintage.service;

import com.mongodb.client.gridfs.model.GridFSFile;
import org.bson.types.ObjectId;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.data.mongodb.gridfs.GridFsOperations;
import org.springframework.data.mongodb.gridfs.GridFsResource;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.Optional;

import static org.springframework.data.mongodb.core.query.Query.query;

@Service
public class GridFsService {

    @Autowired
    private GridFsOperations gridFsOperations;

    /**
     * Save a file to GridFS.
     *
     * @param file the file to save
     * @return the ID of the saved file
     */
    public String saveFile(MultipartFile file) {
        if (file == null || file.isEmpty()) {
            return null;
        }
        
        try {
            ObjectId fileId = gridFsOperations.store(
                file.getInputStream(), 
                file.getOriginalFilename(), 
                file.getContentType()
            );
            return fileId.toString();
        } catch (IOException e) {
            throw new RuntimeException("Failed to store file in GridFS", e);
        }
    }

    /**
     * Update an existing file in GridFS.
     *
     * @param fileId the ID of the existing file
     * @param newFile the new file to replace it with
     * @return the ID of the updated file
     */
    public String updateFile(String fileId, MultipartFile newFile) {
        if (fileId != null) {
            deleteFile(fileId);
        }
        return saveFile(newFile);
    }

    /**
     * Get file content as byte array.
     *
     * @param fileId the ID of the file
     * @return byte array of the file content
     */
    public byte[] getFileContent(String fileId) {
        if (fileId == null) {
            return null;
        }

        try {
            GridFsResource resource = getFile(fileId);
            return Optional.ofNullable(resource)
                    .map(this::readResourceBytes)
                    .orElse(null);
        } catch (IllegalArgumentException e) {
            return null;
        }
    }

    private byte[] readResourceBytes(GridFsResource resource) {
        try {
            return resource.getContentAsByteArray();
        } catch (IOException e) {
            throw new RuntimeException("Failed to read resource content", e);
        }
    }

    /**
     * Retrieve a file from GridFS by its ID.
     *
     * @param fileId the ID of the file
     * @return the GridFsResource containing the file
     */
    public GridFsResource getFile(String fileId) {
        if (fileId == null) {
            return null;
        }

        try {
            GridFSFile gridFSFile = gridFsOperations.findOne(
                query(Criteria.where("_id").is(new ObjectId(fileId)))
            );
            
            if (gridFSFile == null) {
                return null;
            }
            
            return gridFsOperations.getResource(gridFSFile);
        } catch (IllegalArgumentException e) {
            return null;
        }
    }

    /**
     * Delete a file from GridFS by its ID.
     *
     * @param fileId the ID of the file to delete
     */
    public void deleteFile(String fileId) {
        if (fileId != null) {
            try {
                gridFsOperations.delete(
                    query(Criteria.where("_id").is(new ObjectId(fileId)))
                );
            } catch (IllegalArgumentException e) {
                // Ignore if file doesn't exist
            }
        }
    }

    /**
     * Check if a file exists in GridFS.
     *
     * @param fileId the ID of the file
     * @return true if the file exists, false otherwise
     */
    public boolean fileExists(String fileId) {
        if (fileId == null) {
            return false;
        }

        try {
            GridFSFile file = gridFsOperations.findOne(
                query(Criteria.where("_id").is(new ObjectId(fileId)))
            );
            return file != null;
        } catch (IllegalArgumentException e) {
            return false;
        }
    }
}
