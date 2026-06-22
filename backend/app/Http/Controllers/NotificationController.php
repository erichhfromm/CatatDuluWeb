<?php

namespace App\Http\Controllers;

use App\Http\Resources\NotificationResource;
use App\Models\Notification;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class NotificationController extends Controller
{
    public function index(Request $request): \Illuminate\Http\Resources\Json\AnonymousResourceCollection
    {
        $query = auth()->user()->appNotifications();

        if ($request->has('read') && is_bool($request->boolean('read'))) {
            $query->where('is_read', $request->boolean('read'));
        }

        if ($request->has('type')) {
            $query->where('type', $request->type);
        }

        $notifications = $query->orderBy('created_at', 'desc')
            ->paginate($request->get('per_page', 20));

        return NotificationResource::collection($notifications);
    }

    public function show(Notification $notification): JsonResponse
    {
        $this->authorize('view', $notification);

        return response()->json(new NotificationResource($notification));
    }

    public function markAsRead(Notification $notification): JsonResponse
    {
        $this->authorize('update', $notification);

        $notification->markAsRead();

        return response()->json(new NotificationResource($notification));
    }

    public function markAllAsRead(): JsonResponse
    {
        auth()->user()->appNotifications()
            ->where('is_read', false)
            ->update([
                'is_read' => true,
                'read_at' => now(),
            ]);

        return response()->json(['message' => 'All notifications marked as read']);
    }

    public function unreadCount(): JsonResponse
    {
        return response()->json([
            'unread_count' => auth()->user()->appNotifications()->unread()->count(),
        ]);
    }

    public function delete(Notification $notification): JsonResponse
    {
        $this->authorize('delete', $notification);

        $notification->delete();

        return response()->json(['message' => 'Notification deleted']);
    }

    public function deleteAll(): JsonResponse
    {
        auth()->user()->appNotifications()->delete();

        return response()->json(['message' => 'All notifications deleted']);
    }
}
