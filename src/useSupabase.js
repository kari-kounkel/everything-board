import { useState, useEffect, useCallback } from 'react'
import { supabase } from './supabase'

// ============================================================
// UNIVERSE HOOKS
// ============================================================
export function useUniverses(userId) {
  const [universes, setUniverses] = useState([])
  const [loading, setLoading] = useState(true)

  const fetchUniverses = useCallback(async () => {
    if (!userId) return
    const { data, error } = await supabase
      .from('universes')
      .select('*')
      .eq('user_id', userId)
      .order('sort_order', { ascending: true })
    if (!error && data) {
      setUniverses(data.map(row => ({
        id: row.universe_id,
        name: row.name,
        color: row.color,
        glow: row.glow,
        emoji: row.emoji,
        _dbId: row.id, // keep the real PK for updates
      })))
    }
    setLoading(false)
  }, [userId])

  useEffect(() => { fetchUniverses() }, [fetchUniverses])

  const saveUniverses = useCallback(async (newUniverses) => {
    if (!userId) return
    // Delete all existing, re-insert (simplest for reorder/add/remove)
    await supabase.from('universes').delete().eq('user_id', userId)
    const rows = newUniverses.map((u, i) => ({
      user_id: userId,
      universe_id: u.id,
      name: u.name,
      color: u.color,
      glow: u.glow || u.color + '55',
      emoji: u.emoji,
      sort_order: i,
    }))
    if (rows.length > 0) {
      await supabase.from('universes').insert(rows)
    }
    setUniverses(newUniverses)
  }, [userId])

  return { universes, setUniverses: saveUniverses, loading }
}

// ============================================================
// CARDS HOOKS
// ============================================================
export function useCards(userId) {
  const [cards, setCardsState] = useState([])
  const [loading, setLoading] = useState(true)

  const fetchCards = useCallback(async () => {
    if (!userId) return
    const { data, error } = await supabase
      .from('cards')
      .select('*')
      .eq('user_id', userId)
    if (!error && data) {
      setCardsState(data.map(row => ({
        id: row.card_id,
        title: row.title,
        description: row.description || '',
        tab: row.tab,
        list: row.list,
        labels: row.labels || [],
        universes: row.universes || [],
        dueDate: row.due_date || '',
        checklist: row.checklist || [],
        links: row.links || [],
        completedAt: row.completed_at,
        created: row.created_at,
        moved: row.moved_at,
        _dbId: row.id,
      })))
    }
    setLoading(false)
  }, [userId])

  useEffect(() => { fetchCards() }, [fetchCards])

  const toRow = (card) => ({
    user_id: userId,
    card_id: card.id,
    title: card.title,
    description: card.description || '',
    tab: card.tab,
    list: card.list,
    labels: card.labels || [],
    universes: card.universes || [],
    due_date: card.dueDate || '',
    checklist: card.checklist || [],
    links: card.links || [],
    completed_at: card.completedAt || null,
    moved_at: card.moved || new Date().toISOString(),
  })

  const saveCard = useCallback(async (card) => {
    if (!userId) return
    // Check if exists
    const existing = cards.find(c => c.id === card.id)
    if (existing) {
      // Update
      const { data: found } = await supabase
        .from('cards')
        .select('id')
        .eq('user_id', userId)
        .eq('card_id', card.id)
        .single()
      if (found) {
        await supabase.from('cards').update(toRow(card)).eq('id', found.id)
      }
      setCardsState(prev => prev.map(c => c.id === card.id ? card : c))
    } else {
      // Insert
      await supabase.from('cards').insert(toRow(card))
      setCardsState(prev => [...prev, card])
    }
  }, [userId, cards])

  const deleteCard = useCallback(async (cardId) => {
    if (!userId) return
    await supabase.from('cards').delete().eq('user_id', userId).eq('card_id', cardId)
    setCardsState(prev => prev.filter(c => c.id !== cardId))
  }, [userId])

  const setCards = useCallback((updater) => {
    setCardsState(prev => {
      const next = typeof updater === 'function' ? updater(prev) : updater
      return next
    })
  }, [])

  // Bulk save — for drops, imports, etc.
  const bulkSave = useCallback(async (updatedCards) => {
    if (!userId) return
    // Upsert strategy: delete all and reinsert
    // For large boards this should be optimized later, but it works now
    await supabase.from('cards').delete().eq('user_id', userId)
    if (updatedCards.length > 0) {
      const rows = updatedCards.map(c => toRow(c))
      // Supabase insert has a limit, batch in chunks of 500
      for (let i = 0; i < rows.length; i += 500) {
        await supabase.from('cards').insert(rows.slice(i, i + 500))
      }
    }
    setCardsState(updatedCards)
  }, [userId])

  return { cards, setCards, saveCard, deleteCard, bulkSave, loading }
}

// ============================================================
// USER SETTINGS HOOKS
// ============================================================
export function useUserSettings(userId) {
  const [settings, setSettingsState] = useState({ onboarded: false, view_mode: 'circles', subscription_tier: 'free' })
  const [loading, setLoading] = useState(true)

  const fetchSettings = useCallback(async () => {
    if (!userId) return
    const { data, error } = await supabase
      .from('user_settings')
      .select('*')
      .eq('user_id', userId)
      .single()
    if (!error && data) {
      setSettingsState({ 
        onboarded: data.onboarded, 
        view_mode: data.view_mode,
        subscription_tier: data.subscription_tier || 'free'
      })
    } else {
      // Create settings row for new user
      await supabase.from('user_settings').insert({ user_id: userId, onboarded: false, view_mode: 'circles', subscription_tier: 'free' })
    }
    setLoading(false)
  }, [userId])

  useEffect(() => { fetchSettings() }, [fetchSettings])

  const updateSettings = useCallback(async (updates) => {
    if (!userId) return
    await supabase.from('user_settings').update(updates).eq('user_id', userId)
    setSettingsState(prev => ({ ...prev, ...updates }))
  }, [userId])

  return { settings, updateSettings, loading }
}
