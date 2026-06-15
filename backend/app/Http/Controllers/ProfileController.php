<?php

namespace App\Http\Controllers;

use App\Http\Requests\ChangePasswordRequest;
use App\Http\Requests\UpdateProfileRequest;
use App\Http\Resources\UserResource;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class ProfileController extends Controller
{
    public function show(): JsonResponse
    {
        return response()->json(new UserResource(auth()->user()));
    }

    public function update(UpdateProfileRequest $request): JsonResponse
    {
        $user = auth()->user();
        $user->update($request->validated());

        return response()->json(new UserResource($user));
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
            \Storage::delete($user->profile_picture);
        }

        $path = $request->file('image')->store('profiles', 'public');
        $user->update(['profile_picture' => $path]);

        return response()->json([
            'message' => 'Profile picture uploaded successfully',
            'profile_picture' => url('storage/' . $path),
        ]);
    }

    public function preferences(): JsonResponse
    {
        $user = auth()->user();

        return response()->json([
            'currency' => $user->currency,
            'date_format' => $user->date_format,
            'theme' => $user->theme,
        ]);
    }

    public function updatePreferences(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'currency' => ['string', 'size:3'],
            'date_format' => ['string'],
            'theme' => ['in:light,dark'],
        ]);

        $user = auth()->user();
        $user->update($validated);

        return response()->json([
            'message' => 'Preferences updated',
            'preferences' => $validated,
        ]);
    }
}
