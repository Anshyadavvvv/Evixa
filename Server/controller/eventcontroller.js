import express from "express";
import { protect, admin } from "../middleware/auth.js";

//import router from "../controller/eventcontroller.js";


import Event from "../models/event.js";

export const getAllEvents = async (req, res) => {
  try {
    const filters = {};
    if (req.query.category) {
      filters.category = req.query.category;
    }
    if (req.query.location) {
      filters.location = req.query.location;
    }

    const events = await Event.find(filters);

    res.status(200).json(events);
  } catch (error) {
    res.status(500).json({ message: "Error fetching events" });
  }
};

export const getEventById = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);
    if (!event) {
      return res.status(404).json({ message: "Event not found" });
    }
    res.status(200).json(event);
  } catch (error) {
    res.status(500).json({ message: "Error fetching event" });
  }
};

export const createEvent = async (req, res) => {
  const { title, description, date, totalSeats, availableSeats, ticketPrice, imageURL, location, category } = req.body;
  try {
    const newEvent = await Event.create({
      title,
      description,
      date,
      location,
      category,
      totalSeats,
      availableSeats: availableSeats ?? totalSeats,
      ticketPrice,
      imageURL,
      createdBy: req.user.id,
    });
    res.status(201).json(newEvent);
  } catch (error) {
    res.status(500).json({ message: "Error creating event" });
  }
};

export const updateEvent = async (req, res) => {
  const { title, description, date, totalSeats, availableSeats, ticketPrice, imageURL, location, category } = req.body;
  try {
    const updateEvent = await Event.findByIdAndUpdate(req.params.id, {
      title,
      description,
      date,
      location,
      category,
      totalSeats,
      availableSeats,
      ticketPrice,
      imageURL,
    });

    if (!updateEvent) {
      return res.status(404).json({ message: "Event not found" });
    }
    res.status(200).json(updateEvent);
  } catch (error) {
    res.status(500).json({ message: "Error updating event" });
  }
};

export const deleteEvent = async (req, res) => {
  try {
    const event = await Event.findByIdAndDelete(req.params.id);
    if (!event) {
      return res.status(404).json({ message: "Event not found" });
    }
    res.status(200).json({ message: "Event deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting event" });
  }
};
