// frontend/src/services/supabase.js
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Word List Operations
export const wordListService = {
  // Get all word lists
  async getAll() {
    const { data, error } = await supabase
      .from('word_lists')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    return data;
  },

  // Get active word list
  async getActive() {
    const { data, error } = await supabase
      .from('word_lists')
      .select('*')
      .eq('is_active', true)
      .single();
    
    if (error) throw error;
    return data;
  },

  // Create new word list
  async create(name, words) {
    const { data, error } = await supabase
      .from('word_lists')
      .insert([
        { 
          name, 
          words: words.map(w => ({ text: w, mastered: false })),
          is_active: false 
        }
      ])
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },

  // Set active word list (and deactivate others)
  async setActive(id) {
    // First, deactivate all
    await supabase
      .from('word_lists')
      .update({ is_active: false })
      .neq('id', '00000000-0000-0000-0000-000000000000'); // Update all
    
    // Then activate the selected one
    const { data, error } = await supabase
      .from('word_lists')
      .update({ is_active: true })
      .eq('id', id)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },

  // Delete word list
  async delete(id) {
    const { error } = await supabase
      .from('word_lists')
      .delete()
      .eq('id', id);
    
    if (error) throw error;
  }
};

// Test Results Operations
export const testResultService = {
  // Save test result
  async create(wordListId, score, total, details) {
    const { data, error } = await supabase
      .from('test_results')
      .insert([
        {
          word_list_id: wordListId,
          score,
          total,
          details
        }
      ])
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },

  // Get all results for a word list
  async getByWordList(wordListId) {
    const { data, error } = await supabase
      .from('test_results')
      .select('*')
      .eq('word_list_id', wordListId)
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    return data;
  }
};

// Feedback Media Operations
export const feedbackService = {
  // Upload voice clip
  async uploadVoice(file, isPositive) {
    const fileName = `${isPositive ? 'positive' : 'negative'}-${Date.now()}.${file.name.split('.').pop()}`;
    const { data, error } = await supabase.storage
      .from('voice-clips')
      .upload(fileName, file);
    
    if (error) throw error;
    return data;
  },

  // Upload image
  async uploadImage(file, isHappy) {
    const fileName = `${isHappy ? 'happy' : 'concerned'}-${Date.now()}.${file.name.split('.').pop()}`;
    const { data, error } = await supabase.storage
      .from('feedback-images')
      .upload(fileName, file);
    
    if (error) throw error;
    return data;
  },

  // Get all voice clips
  async getVoiceClips() {
    const { data, error } = await supabase.storage
      .from('voice-clips')
      .list();
    
    if (error) throw error;
    return data;
  },

  // Get all feedback images
  async getImages() {
    const { data, error } = await supabase.storage
      .from('feedback-images')
      .list();
    
    if (error) throw error;
    return data;
  },

  // Get public URL for file
  getPublicUrl(bucket, path) {
    const { data } = supabase.storage
      .from(bucket)
      .getPublicUrl(path);
    
    return data.publicUrl;
  }
};