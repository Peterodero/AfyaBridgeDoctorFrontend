// src/pages/Notifications.jsx
import { useState, useEffect } from 'react'
import { Trash2, CheckCheck, Bell, Calendar, AlertTriangle, MessageSquare, FileText, Settings2, X, Filter, Loader2, Loader } from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import { useUI } from '../context/UIContext'
import { notificationsApi } from '../api/notifications'

const TYPE_CFG = {
  appointment:  { icon: Calendar,      bg: 'bg-blue-50',     iconColor: 'text-blue-600',    dot: 'bg-blue-400',   label: 'Appointment'  },
  critical:     { icon: AlertTriangle, bg: 'bg-red-50',      iconColor: 'text-red-600',     dot: 'bg-red-500',     label: 'Critical'     },
  message:      { icon: MessageSquare, bg: 'bg-blue-50',     iconColor: 'text-blue-600',    dot: 'bg-blue-400',    label: 'Message'      },
  prescription: { icon: FileText,      bg: 'bg-emerald-50',  iconColor: 'text-emerald-600', dot: 'bg-emerald-500', label: 'Prescription' },
  system:       { icon: Settings2,     bg: 'bg-gray-100',    iconColor: 'text-gray-500',    dot: 'bg-gray-400',    label: 'System'       },
  broadcast:    { icon: Bell,          bg: 'bg-purple-50',   iconColor: 'text-purple-600',  dot: 'bg-purple-500',  label: 'Broadcast'    },
}

function groupNotifications(notifications) {
  const today = []
  const yesterday = []
  const older = []
  const now = new Date()
  const todayDate = now.toDateString()
  const yesterdayDate = new Date(now.setDate(now.getDate() - 1)).toDateString()

  notifications.forEach(n => {
    const sentDate = new Date(n.sent_at).toDateString()
    
    if (sentDate === todayDate) {
      today.push(n)
    } else if (sentDate === yesterdayDate) {
      yesterday.push(n)
    } else {
      older.push(n)
    }
  })
  
  const groups = []
  if (today.length) groups.push({ label: 'Today', items: today })
  if (yesterday.length) groups.push({ label: 'Yesterday', items: yesterday })
  if (older.length) groups.push({ label: 'Earlier', items: older })
  return groups
}

function formatTime(dateString) {
  const date = new Date(dateString)
  const now = new Date()
  const diffMs = now - date
  const diffMins = Math.floor(diffMs / 60000)
  const diffHours = Math.floor(diffMins / 60)
  const diffDays = Math.floor(diffHours / 24)
  
  if (diffMins < 1) return 'Just now'
  if (diffMins < 60) return `${diffMins} min ago`
  if (diffHours < 24) return `${diffHours} hr ago`
  if (diffDays === 1) return 'Yesterday'
  return date.toLocaleDateString('en-KE', { month: 'short', day: 'numeric' })
}

function getInitials(name) {
  if (!name) return '?'
  return name.split(' ').filter(Boolean).map(n => n[0]).join('').slice(0, 2).toUpperCase()
}

export default function Notifications() {
  const { token } = useAuth()
  const { showToast } = useUI()
  
  const [notifications, setNotifications] = useState([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState('all')
  const [showFilters, setShowFilters] = useState(false)
  const [markingAll, setMarkingAll] = useState(false)
  const [deleting, setDeleting] = useState(null)

  const fetchNotifications = async () => {
    try {
      const data = await notificationsApi.getNotifications(token)
      setNotifications(data.data || [])
    } catch (err) {
      showToast(err.message || 'Failed to load notifications', 'error')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchNotifications()
    // Optional: Auto-refresh every 20 seconds
    const interval = setInterval(fetchNotifications, 20000)
    return () => clearInterval(interval)
  }, [])

  const unreadCount = notifications.filter(n => !n.is_read).length
  const filtered = filter === 'unread' ? notifications.filter(n => !n.is_read) : notifications
  const groups = groupNotifications(filtered)

  const handleMarkAsRead = async (id) => {
    try {
      await notificationsApi.markAsRead(token, id)
      setNotifications(prev =>
        prev.map(n => n.id === id ? { ...n, is_read: true, read_at: new Date().toISOString() } : n)
      )
    } catch (err) {
      showToast(err.message || 'Failed to mark as read', 'error')
    }
  }

  // const handleMarkAllRead = async () => {
  //   setMarkingAll(true)
  //   try {
  //     await notificationsApi.markAllAsRead(token)
  //     setNotifications(prev =>
  //       prev.map(n => ({ ...n, is_read: true, read_at: new Date().toISOString() }))
  //     )
  //     showToast('All notifications marked as read', 'success')
  //   } catch (err) {
  //     showToast(err.message || 'Failed to mark all as read', 'error')
  //   } finally {
  //     setMarkingAll(false)
  //   }
  // }

  const handleDelete = async (id) => {
    setDeleting(id)
    try {
      await notificationsApi.deleteNotification(token, id)
      setNotifications(prev => prev.filter(n => n.id !== id))
      showToast('Notification deleted', 'success')
    } catch (err) {
      showToast(err.message || 'Failed to delete notification', 'error')
    } finally {
      setDeleting(null)
    }
  }

  const handleDeleteAll = async () => {
    if (!confirm('Are you sure you want to delete all notifications? This action cannot be undone.')) return
    
    try {
      await notificationsApi.deleteAllNotifications(token)
      setNotifications([])
      showToast('All notifications deleted', 'success')
    } catch (err) {
      showToast(err.message || 'Failed to delete notifications', 'error')
    }
  }

  const getTypeConfig = (type) => {
    return TYPE_CFG[type] || TYPE_CFG.system
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50/50 flex items-center justify-center">
        <div className="text-center">
          <Loader size={32} className="animate-spin text-primary mx-auto mb-4" />
          <p className="text-slate-500">Loading notifications...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-slate-50/50 p-6 md:p-8 flex flex-col gap-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-black text-slate-900 tracking-tight m-0">Notifications</h1>
          <p className="text-sm text-slate-400 m-0 mt-1">
            {unreadCount > 0 ? (
              <>
                <span className="font-bold text-primary">{unreadCount} unread</span> · stay on top of updates
              </>
            ) : (
              "You're all caught up!"
            )}
          </p>
        </div>
        
        <div className="flex flex-wrap items-center gap-2">
          <button 
            onClick={() => setShowFilters(!showFilters)}
            className="lg:hidden px-4 py-2 rounded-xl bg-white border border-slate-200 text-slate-600 text-sm font-semibold hover:bg-slate-50 transition-all flex items-center gap-2"
          >
            <Filter size={14} /> Filter
          </button>

          {notifications.length > 0 && (
            <button 
              onClick={handleDeleteAll} 
              className="px-4 py-2 rounded-xl bg-transparent text-red-500 text-sm font-semibold hover:bg-red-50 transition-all flex items-center gap-2"
            >
              <Trash2 size={14} /> Clear all
            </button>
          )}
        </div>
      </div>

      {/* Filter tabs */}
      <div className="hidden lg:flex gap-1 p-1 rounded-xl w-fit bg-gray-100">
        {[
          ['all', 'All Notifications'],
          ['unread', 'Unread Only']
        ].map(([key, label]) => (
          <button 
            key={key} 
            onClick={() => setFilter(key)}
            className={`px-5 h-9 rounded-lg text-sm font-semibold transition-all relative
              ${filter === key 
                ? 'bg-white text-slate-900 shadow-sm' 
                : 'bg-transparent text-slate-400 hover:text-slate-600'}`}
          >
            {label}
            {key === 'unread' && unreadCount > 0 && (
              <span className="ml-2 px-1.5 py-0.5 text-white text-[10px] font-black rounded-full bg-linear-to-r from-blue-500 to-blue-600">
                {unreadCount}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Mobile filter menu */}
      {showFilters && (
        <div className="lg:hidden flex flex-col gap-2 p-4 bg-white rounded-xl shadow-lg border border-slate-100">
          <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Filter by</p>
          {[
            ['all', 'All Notifications'],
            ['unread', 'Unread Only']
          ].map(([key, label]) => (
            <button 
              key={key} 
              onClick={() => { setFilter(key); setShowFilters(false); }}
              className={`w-full text-left px-4 py-2 rounded-lg text-sm font-semibold transition-all
                ${filter === key ? 'bg-blue-50 text-blue-600' : 'text-slate-600 hover:bg-slate-50'}`}
            >
              {label}
              {key === 'unread' && unreadCount > 0 && (
                <span className="ml-2 px-1.5 py-0.5 text-white text-[10px] font-black rounded-full bg-linear-to-r from-blue-500 to-blue-600">
                  {unreadCount}
                </span>
              )}
            </button>
          ))}
        </div>
      )}

      {/* Stats summary */}
      {notifications.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
          {Object.entries(TYPE_CFG).map(([key, cfg]) => {
            const count = notifications.filter(n => n.notification_type === key).length
            if (count === 0) return null
            return (
              <div key={key} className="bg-white rounded-xl p-3 border border-slate-100 flex items-center gap-2">
                <div className={`w-8 h-8 rounded-lg ${cfg.bg} flex items-center justify-center`}>
                  <cfg.icon size={14} className={cfg.iconColor} />
                </div>
                <div>
                  <p className="text-xs text-slate-500">{cfg.label}</p>
                  <p className="text-lg font-bold text-slate-900">{count}</p>
                </div>
              </div>
            )
          })}
        </div>
      )}

      {/* Notification list */}
      {notifications.length === 0 ? (
        <div className="flex justify-center">
          <div className="bg-white rounded-2xl p-16 flex flex-col items-center text-center gap-4 shadow-sm border border-slate-100 w-full max-w-md">
            <div className="w-20 h-20 rounded-2xl flex items-center justify-center bg-linear-to-br from-blue-50 to-blue-100">
              <Bell size={32} className="text-blue-500" />
            </div>
            <div>
              <p className="text-lg font-bold text-slate-900 m-0">No notifications</p>
              <p className="text-sm text-slate-400 m-0 mt-2">You're all caught up! New notifications will appear here.</p>
            </div>
          </div>
        </div>
      ) : filtered.length === 0 ? (
        <div className="flex justify-center">
          <div className="bg-white rounded-2xl p-12 flex flex-col items-center text-center gap-4 shadow-sm border border-slate-100">
            <CheckCheck size={48} className="text-emerald-400" />
            <div>
              <p className="text-lg font-bold text-slate-900 m-0">All caught up!</p>
              <p className="text-sm text-slate-400 m-0 mt-2">No unread notifications at the moment.</p>
            </div>
            <button 
              onClick={() => setFilter('all')}
              className="px-4 py-2 rounded-xl bg-blue-500 text-white text-sm font-semibold hover:bg-blue-600 transition-colors"
            >
              View all notifications
            </button>
          </div>
        </div>
      ) : (
        <div className="flex flex-col gap-5 w-full max-w-4xl">
          {groups.map(({ label, items }) => (
            <div key={label}>
              <div className="flex items-center justify-between mb-3">
                <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">{label}</p>
                <span className="text-xs text-slate-400">{items.length} notification{items.length !== 1 ? 's' : ''}</span>
              </div>
              <div className="bg-white rounded-2xl overflow-hidden divide-y divide-slate-100 shadow-sm border border-slate-100">
                {items.map((n) => {
                  const cfg = getTypeConfig(n.notification_type)
                  const Icon = cfg.icon
                  const initials = n.user_id ? getInitials(n.user_id) : null
                  
                  return (
                    <div 
                      key={n.id} 
                      onClick={() => !n.is_read && handleMarkAsRead(n.id)}
                      className={`group flex items-start gap-4 px-4 sm:px-6 py-4 transition-all relative
                        ${!n.is_read ? 'cursor-pointer hover:bg-blue-50/30' : 'hover:bg-slate-50/50'}`}
                      style={!n.is_read ? { background: 'linear-gradient(135deg, rgba(19,127,236,0.02), rgba(19,182,236,0.01))' } : {}}
                    >

                      {/* Unread indicator */}
                      {!n.is_read && (
                        <span className="absolute left-2 top-1/2 -translate-y-1/2 w-1.5 h-1.5 rounded-full bg-linear-to-r from-blue-500 to-blue-600" />
                      )}

                      {/* Avatar / Icon */}
                      <div className="shrink-0 mt-0.5">
                        {initials && n.notification_type !== 'system' ? (
                          <div className="relative">
                            <div className="w-10 h-10 rounded-xl flex items-center justify-center text-xs font-bold text-white shadow-sm bg-linear-to-r from-blue-500 to-blue-600">
                              {initials}
                            </div>
                            <div className={`absolute -bottom-1 -right-1 w-5 h-5 rounded-lg ${cfg.bg} flex items-center justify-center border-2 border-white shadow-sm`}>
                              <Icon size={10} className={cfg.iconColor} />
                            </div>
                          </div>
                        ) : (
                          <div className={`w-10 h-10 rounded-xl ${cfg.bg} flex items-center justify-center`}>
                            <Icon size={18} className={cfg.iconColor} />
                          </div>
                        )}
                      </div>

                      {/* Content */}
                      <div className="flex-1 min-w-0">
                        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-2">
                          <p className={`text-sm m-0 leading-snug ${!n.is_read ? 'font-bold text-slate-900' : 'font-semibold text-slate-700'}`}>
                            {n.title}
                          </p>
                          <span className="text-[10px] text-slate-600 whitespace-nowrap shrink-0">
                            {formatTime(n.sent_at)}
                          </span>
                        </div>
                        <p className="text-[13px] text-slate-400 m-0 mt-1 leading-relaxed">{n.message}</p>
                        
                        <div className="flex flex-wrap items-center gap-3 mt-2">
                          <span className={`text-[10px] font-black uppercase tracking-[1px] flex items-center gap-1 ${cfg.iconColor}`}>
                            <span className={`w-1.5 h-1.5 rounded-full ${cfg.dot}`} />
                            {cfg.label}
                          </span>
                          
                          {!n.is_read && (
                            <button 
                              onClick={(e) => { e.stopPropagation(); handleMarkAsRead(n.id) }}
                              className="text-[11px] font-semibold text-slate-300 hover:text-blue-600 bg-transparent border-none cursor-pointer p-0 transition-colors"
                            >
                              Mark as read
                            </button>
                          )}
                          
                          <button 
                            onClick={(e) => { e.stopPropagation(); handleDelete(n.id) }}
                            disabled={deleting === n.id}
                            className="text-[11px] font-semibold text-slate-300 hover:text-red-500 bg-transparent border-none cursor-pointer p-0 transition-colors sm:hidden disabled:opacity-50"
                          >
                            {deleting === n.id ? 'Deleting...' : 'Delete'}
                          </button>
                        </div>
                      </div>

                      {/* Delete button - desktop */}
                      <button 
                        onClick={(e) => { e.stopPropagation(); handleDelete(n.id) }}
                        disabled={deleting === n.id}
                        className="hidden sm:flex shrink-0 w-7 h-7 rounded-lg bg-transparent border-none cursor-pointer text-slate-200 hover:text-red-500 hover:bg-red-50 transition-all items-center justify-center opacity-0 group-hover:opacity-100 mt-0.5 disabled:opacity-50"
                      >
                        {deleting === n.id ? <Loader2 size={13} className="animate-spin" /> : <X size={13} />}
                      </button>
                    </div>
                  )
                })}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Footer */}
      {notifications.length > 0 && (
        <div className="flex justify-between items-center text-xs text-slate-500 mt-4 pt-4 border-t border-slate-100">
          <span>{notifications.length} total notifications</span>
          <span>Auto-refresh every 30 seconds</span>
        </div>
      )}
    </div>
  )
}