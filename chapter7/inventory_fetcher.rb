class InventoryFetcher

  def initialize(arg)
    @inventory = arg[:inventory]
    @orders = arg[:orders]

    unless @inventory && @orders
      raise 'must initialize with :inventory and :orders arguments' 
    end
  end

  def add_to_cart(order_id, *items)
    item_selectors = []
    items.each do |item|
      item[:quantity].times do
        item_selectors << {:sku => item[:sku]}
      end
    end

    transition_state(order_id, item_selectors, {:from => AVAILABLE, :to => IN_CART})
  end
 
  def transition_state(order_id, selectors, opts={})
    items_transitioned = []
    begin # use a begin/end block so we can do error recovery

      for selector in selectors do
        query = selector.merge({:state => opts[:from]})
        physical_item = @inventory.find_and_modify({
            :query => query,
            :update => {
              '$set' => {
                :state => opts[:to],          # target state
                :ts => Time.now.utc           # get the current client time
              }
            }
          })

        if physical_item.nil?
          raise InventoryFetchFailure
        end

        items_transitioned << physical_item['_id']   # push item into array
        @orders.update({:_id => order_id}, {
            '$push' => {
              :item_ids => physical_item['_id']
            }
          })
      end # of for loop

    rescue Mongo::OperationFailure, InventoryFetchFailure
      rollback(order_id, items_transitioned, opts[:from], opts[:to])
      raise InventoryFetchFailure, "Failed to add #{selector[:sku]}"
    end

    return items_transitioned.size
  end

  def rollback(order_id, item_ids, old_state, new_state)
    @orders.update({"_id" => order_id},
      {"$pullAll" => {:item_ids => item_ids}})

    item_ids.each do |id|
      @inventory.find_and_modify({
        :query => {
          "_id" => id,
          :state => new_state
        }
      },
      {
        :update => {
          "$set" => {
            :state => old_state, 
            :ts => Time.now.utc
          }
        }
      })
    end
  end
 
end
