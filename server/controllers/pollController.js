// controllers/pollController.js
const Poll = require('../models/pollSchema ');

exports.getAllPolls = async (req, res) => {
  try {
    const polls = await Poll.find().populate('createdBy', 'username');
    res.status(200).json(polls);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

exports.createPoll = async (req, res) => {
  try {
    const { question, options, visibility, duration, durationUnit,createdBy } = req.body;
    const pollOptions = options.map((option) => ({ option, votes: 0 }));

    const poll = new Poll({
      question,
      options: pollOptions,
      visibility,
      duration,
      durationUnit,
      createdBy,
      createdAt: new Date(),
      isOpen: true, 
    });

    await poll.save();
    res.status(201).json({ message: 'Poll created successfully', poll });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

exports.getPollById = async (req, res) => {
  try {
    const { id } = req.params;
    const poll = await Poll.findById(id);

    if (!poll) {
      return res.status(404).json({ message: 'Poll not found' });
    }

    if (!poll.isOpen) {
      return res.status(403).json({ message: 'Poll duration has ended' });
    }

    res.status(200).json(poll);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

exports.vote = async (req, res) => {
  try {
    const { pollId, optionId } = req.body;

    if (!pollId || !optionId) {
      return res.status(400).json({ message: 'Both pollId and optionId are required.' });
    }

    const poll = await Poll.findById(pollId);

    if (!poll) {
      return res.status(404).json({ message: 'Poll not found' });
    }

    const selectedOption = poll.options.find((o) => o.id === optionId);

    if (!selectedOption) {
      return res.status(400).json({ message: 'Option not found' });
    }

    const updatedPoll = await Poll.findOneAndUpdate(
      { _id: pollId, 'options._id': selectedOption._id },
      { $inc: { 'options.$.votes': 1 } },
      { new: true }
    );

    return res.status(200).json({ message: 'Vote recorded successfully' });
  } catch (error) {
    console.error('Error recording vote:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
};