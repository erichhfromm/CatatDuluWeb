<?php

namespace App\Http\Controllers;

use App\Http\Resources\CategoryResource;
use App\Models\Category;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class CategoryController extends Controller
{
    public function index(Request $request): \Illuminate\Http\Resources\Json\AnonymousResourceCollection
    {
        // Safety net: jika user belum punya kategori sama sekali, generate default
        if (auth()->user()->categories()->count() === 0) {
            $this->generateDefaultCategoriesForUser(auth()->user());
        }

        $query = auth()->user()->categories();

        if ($request->has('type')) {
            $query->where('type', $request->type);
        }

        $categories = $query->with('transactions')
            ->orderBy('name')
            ->paginate($request->get('per_page', 30));

        return CategoryResource::collection($categories);
    }

    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'name' => ['required', 'string', 'min:2', 'max:100'],
            'type' => ['required', 'in:income,expense'],
            'description' => ['nullable', 'string', 'max:500'],
            'icon' => ['nullable', 'string'],
            'color' => ['nullable', 'string', 'regex:/^#[0-9A-F]{6}$/i'],
        ]);

        $validated['slug'] = \Str::slug($validated['name']);
        $category = auth()->user()->categories()->create($validated);

        return response()->json(new CategoryResource($category), 201);
    }

    public function show(Category $category): JsonResponse
    {
        $this->authorize('view', $category);

        return response()->json(new CategoryResource($category));
    }

    public function update(Request $request, Category $category): JsonResponse
    {
        $this->authorize('update', $category);

        $validated = $request->validate([
            'name' => ['string', 'min:2', 'max:100'],
            'description' => ['nullable', 'string', 'max:500'],
            'icon' => ['nullable', 'string'],
            'color' => ['nullable', 'string', 'regex:/^#[0-9A-F]{6}$/i'],
        ]);

        if (isset($validated['name'])) {
            $validated['slug'] = \Str::slug($validated['name']);
        }

        $category->update($validated);

        return response()->json(new CategoryResource($category));
    }

    public function destroy(Category $category): JsonResponse
    {
        $this->authorize('delete', $category);

        $category->delete();

        return response()->json(['message' => 'Category deleted successfully']);
    }

    public function default(Request $request): JsonResponse
    {
        $type = $request->validate(['type' => 'required|in:income,expense'])['type'];

        $categories = collect([
            'income' => [
                ['name' => 'Salary', 'icon' => '💰', 'color' => '#10B981'],
                ['name' => 'Freelance', 'icon' => '💻', 'color' => '#3B82F6'],
                ['name' => 'Investment', 'icon' => '📈', 'color' => '#8B5CF6'],
                ['name' => 'Bonus', 'icon' => '🎁', 'color' => '#F59E0B'],
                ['name' => 'Other Income', 'icon' => '💸', 'color' => '#6B7280'],
            ],
            'expense' => [
                ['name' => 'Food & Dining', 'icon' => '🍔', 'color' => '#EF4444'],
                ['name' => 'Transportation', 'icon' => '🚗', 'color' => '#F97316'],
                ['name' => 'Entertainment', 'icon' => '🎬', 'color' => '#EC4899'],
                ['name' => 'Utilities', 'icon' => '💡', 'color' => '#06B6D4'],
                ['name' => 'Healthcare', 'icon' => '⚕️', 'color' => '#D946EF'],
                ['name' => 'Shopping', 'icon' => '🛍️', 'color' => '#8B5CF6'],
                ['name' => 'Education', 'icon' => '📚', 'color' => '#3B82F6'],
                ['name' => 'Personal Care', 'icon' => '💅', 'color' => '#06B6D4'],
                ['name' => 'Rent', 'icon' => '🏠', 'color' => '#10B981'],
                ['name' => 'Other Expense', 'icon' => '📌', 'color' => '#6B7280'],
            ],
        ])[$type] ?? [];

        return response()->json(['categories' => $categories]);
    }

    private function generateDefaultCategoriesForUser(\App\Models\User $user): void
    {
        $incomeCategories = [
            ['name' => 'Salary', 'icon' => '💰', 'color' => '#10B981'],
            ['name' => 'Freelance', 'icon' => '💻', 'color' => '#3B82F6'],
            ['name' => 'Investment', 'icon' => '📈', 'color' => '#8B5CF6'],
            ['name' => 'Bonus', 'icon' => '🎁', 'color' => '#F59E0B'],
        ];

        $expenseCategories = [
            ['name' => 'Food & Dining', 'icon' => '🍔', 'color' => '#EF4444'],
            ['name' => 'Transportation', 'icon' => '🚗', 'color' => '#F97316'],
            ['name' => 'Entertainment', 'icon' => '🎬', 'color' => '#EC4899'],
            ['name' => 'Utilities', 'icon' => '💡', 'color' => '#06B6D4'],
            ['name' => 'Healthcare', 'icon' => '⚕️', 'color' => '#D946EF'],
            ['name' => 'Shopping', 'icon' => '🛍️', 'color' => '#8B5CF6'],
            ['name' => 'Education', 'icon' => '📚', 'color' => '#3B82F6'],
            ['name' => 'Rent', 'icon' => '🏠', 'color' => '#10B981'],
        ];

        foreach ($incomeCategories as $cat) {
            $user->categories()->create(array_merge($cat, [
                'type' => 'income',
                'slug' => \Str::slug($cat['name']),
                'is_custom' => false,
            ]));
        }

        foreach ($expenseCategories as $cat) {
            $user->categories()->create(array_merge($cat, [
                'type' => 'expense',
                'slug' => \Str::slug($cat['name']),
                'is_custom' => false,
            ]));
        }
    }
}
