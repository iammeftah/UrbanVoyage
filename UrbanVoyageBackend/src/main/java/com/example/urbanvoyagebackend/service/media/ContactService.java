package com.example.urbanvoyagebackend.service.media;

import com.example.urbanvoyagebackend.entity.media.Contact;
import com.example.urbanvoyagebackend.entity.media.ContactMessage;
import com.example.urbanvoyagebackend.repository.media.ContactRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ContactService {
    @Autowired
    private ContactRepository contactRepository;

    public Contact saveContact(Contact contact) {
        return contactRepository.save(contact);
    }

    public List<Contact> getAllMessages() {
        return contactRepository.findAll();
    }

    public void deleteMessage(Long id) {
        contactRepository.deleteById(id);
    }
}