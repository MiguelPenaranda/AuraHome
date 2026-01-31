import { supabase } from './supabase';

export const updateStock = async (productId: string, amount: number, profileId: string, homeId: string) => {
  // 1. Insertamos la transacción (quién hizo qué)
  const { error: transError } = await supabase
    .from('inventory_transactions')
    .insert([{ 
      product_id: productId, 
      change_amount: amount, 
      profile_id: profileId,
      home_id: homeId 
    }]);

  if (transError) throw transError;

  // 2. Actualizamos el stock real en la tabla productos (Lógica simple por ahora)
  // Nota: En un entorno pro, esto se hace con una "RPC" o "Function" en SQL para evitar errores de cálculo
  const { data: product } = await supabase.from('products').select('quantity').eq('id', productId).single();
  
  const { error: prodError } = await supabase
    .from('products')
    .update({ quantity: (product?.quantity || 0) + amount })
    .eq('id', productId);

  if (prodError) throw prodError;
};