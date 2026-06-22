<?php

namespace App\Http\Controllers;

use App\Http\Requests\ChangePasswordRequest;
use App\Http\Requests\UpdateProfileRequest;
use App\Http\Resources\UserResource;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class ProfileController extends Controller
{
    public function show(): JsonResponse
    {
        return response()->json(['data' => new UserResource(auth()->user())]);
    }

    public function update(UpdateProfileRequest $request): JsonResponse
    {
        $user = auth()->user();
        $user->update($request->validated());

        return response()->json(['data' => new UserResource($user)]);
    }

    public function changePassword(ChangePasswordRequest $request): JsonResponse
    {
        $user = auth()->user();
        $user->update(['password' => $request->password]);

        return response()->json(['message' => 'Password changed successfully']);
    }

    public function uploadProfilePicture(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'image' => ['required', 'image', 'max:2048', 'mimes:jpeg,png,jpg,gif'],
        ]);

        $user = auth()->user();

        if ($user->profile_picture) {
            \Storage::disk('public')->delete($user->profile_picture);
        }

        $path = $request->file('image')->store('profiles', 'public');
        $user->update(['profile_picture' => $path]);

        return response()->json([
            'message'         => 'Profile picture uploaded successfully',
            'profile_picture' => url('storage/' . $path),
        ]);
    }

    public function preferences(): JsonResponse
    {
        $user = auth()->user();

        return response()->json([
            'currency'    => $user->currency,
            'date_format' => $user->date_format,
            'theme'       => $user->theme,
            'preferences' => $user->preferences ?? [],
        ]);
    }

    public function updatePreferences(Request $request): JsonResponse
    {
        $user = auth()->user();

        $topLevel = $request->validate([
            'currency'    => ['nullable', 'string', 'size:3'],
            'date_format' => ['nullable', 'string'],
            'theme'       => ['nullable', 'in:light,dark'],
        ]);
        $topLevel = array_filter($topLevel, fn ($v) => $v !== null);

        $nestedPrefs = $request->input('preferences');

        $updates = $topLevel;
        if (is_array($nestedPrefs)) {
            $current = $user->preferences ?? [];
            $updates['preferences'] = array_merge($current, $nestedPrefs);
        }

        $user->update($updates);

        return response()->json([
            'message'     => 'Preferences updated',
            'preferences' => $user->fresh()->preferences,
        ]);
    }

    // ─── Export Data ─────────────────────────────────────────────────────────
    public function exportData(): JsonResponse
    {
        $user = auth()->user();

        $data = [
            'exported_at'  => now()->toIso8601String(),
            'profile'      => new UserResource($user),
            'transactions' => $user->transactions()->with('category')->latest()->get()->map(fn ($t) => [
                'id'               => $t->id,
                'type'             => $t->type,
                'amount'           => $t->amount,
                'description'      => $t->description,
                'category'         => $t->category?->name,
                'payment_method'   => $t->payment_method,
                'transaction_date' => $t->transaction_date,
            ]),
            'budgets' => $user->budgets()->with('categories.category')->get()->map(fn ($b) => [
                'id'         => $b->id,
                'name'       => $b->name,
                'amount'     => $b->amount,
                'period'     => $b->period,
                'start_date' => $b->start_date,
                'end_date'   => $b->end_date,
                'is_active'  => $b->is_active,
            ]),
        ];

        return response()->json($data);
    }

    // ─── Disable Account ─────────────────────────────────────────────────────
    public function disableAccount(): JsonResponse
    {
        $user = auth()->user();
        $user->update(['is_active' => false]);
        $user->tokens()->delete();

        return response()->json(['message' => 'Akun berhasil dinonaktifkan.']);
    }

    // ─── Delete Account ───────────────────────────────────────────────────────
    public function destroy(): JsonResponse
    {
        $user = auth()->user();
        $user->tokens()->delete();

        DB::transaction(function () use ($user) {
            $user->transactions()->delete();
            $user->categories()->delete();
            $user->budgets()->each(function ($b) {
                $b->categories()->delete();
                $b->alerts()->delete();
                $b->delete();
            });
            $user->appNotifications()->delete();
            $user->reports()->delete();
            $user->delete();
        });

        return response()->json(['message' => 'Akun berhasil dihapus secara permanen.']);
    }
}
